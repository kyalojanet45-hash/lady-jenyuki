import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

function getUserFromToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// Create a new order
export async function POST(request: Request) {
  try {
    const user = getUserFromToken(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    const { bakerId, pastryType, quantity, totalAmount } = await request.json();

    if (!bakerId || !pastryType || !quantity || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields: bakerId, pastryType, quantity, totalAmount' },
        { status: 400 }
      );
    }

    // Verify baker exists and is approved
    const bakerProfile = await prisma.profile.findUnique({
      where: { id: bakerId },
      include: {
        user: true,
      },
    });

    if (!bakerProfile || bakerProfile.user.role !== 'BAKER') {
      return NextResponse.json(
        { error: 'Invalid baker' },
        { status: 400 }
      );
    }

    if (bakerProfile.bakerStatus !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Baker is not approved yet' },
        { status: 400 }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        bakerId,
        pastryType,
        quantity: parseInt(quantity),
        totalAmount: parseFloat(totalAmount),
        status: 'pending',
      },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        baker: {
          select: {
            firstName: true,
            lastName: true,
            businessName: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Order created successfully', order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Get orders (for user or baker)
export async function GET(request: Request) {
  try {
    const user = getUserFromToken(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'placed' or 'received'

    let orders;

    if (type === 'received') {
      // Get orders received by baker
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
      });

      if (!profile) {
        return NextResponse.json({ orders: [] }, { status: 200 });
      }

      orders = await prisma.order.findMany({
        where: { bakerId: profile.id },
        include: {
          user: {
            select: {
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Get orders placed by user
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: {
          baker: {
            select: {
              firstName: true,
              lastName: true,
              businessName: true,
              phone: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

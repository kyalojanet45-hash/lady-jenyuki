import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Create a new order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { bakerId, pastryType, quantity, totalAmount } = await request.json();

    if (!bakerId || !pastryType || !quantity || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
        userId: session.user.id,
        bakerId,
        pastryType,
        quantity,
        totalAmount,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        baker: {
          select: {
            firstName: true,
            lastName: true,
            businessName: true,
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
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'placed' or 'received'

    let orders;

    if (type === 'received') {
      // Get orders received by baker
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
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
        where: { userId: session.user.id },
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

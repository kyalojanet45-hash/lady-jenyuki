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

// Get all approved bakers
export async function GET(request: Request) {
  try {
    const bakers = await prisma.profile.findMany({
      where: {
        bakerStatus: 'APPROVED',
        user: {
          role: 'BAKER',
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        phone: true,
        photos: true,
        specialties: true,
        businessName: true,
        businessAddress: true,
        education: {
          select: {
            universityName: true,
            courseName: true,
            graduationYear: true,
          },
        },
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

    return NextResponse.json({ bakers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bakers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bakers' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get all approved bakers (public)
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
        education: true,
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

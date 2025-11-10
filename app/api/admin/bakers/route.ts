import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
// GET all baker profiles for admin review
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    
    const where = {
      user: {
        role: 'BAKER',
      },
    };

    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      //@ts-expect-error:fix
      where.bakerStatus = status;
    }

    const bakers = await prisma.profile.findMany({
       //@ts-expect-error:fix
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        education: true,
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

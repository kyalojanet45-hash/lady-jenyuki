import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Update baker status (approve/reject)
export async function PATCH(
  request: Request,
  //@ts-expect-error:fx
  { params }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { status } = await request.json();

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.update({
      where: { id: params.id },
      data: { bakerStatus: status },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Baker status updated successfully', profile },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating baker status:', error);
    return NextResponse.json(
      { error: 'Failed to update baker status' },
      { status: 500 }
    );
  }
}

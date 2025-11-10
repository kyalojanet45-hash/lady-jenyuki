import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get single baker profile
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const baker = await prisma.profile.findUnique({
      where: { id },
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
        bakerStatus: true,
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
            role: true,
          },
        },
      },
    });

    if (!baker) {
      return NextResponse.json(
        { error: 'Baker not found' },
        { status: 404 }
      );
    }

    if (baker.user.role !== 'BAKER') {
      return NextResponse.json(
        { error: 'Profile is not a baker' },
        { status: 400 }
      );
    }

    return NextResponse.json({ baker }, { status: 200 });
  } catch (error) {
    console.error('Error fetching baker:', error);
    return NextResponse.json(
      { error: 'Failed to fetch baker' },
      { status: 500 }
    );
  }
}

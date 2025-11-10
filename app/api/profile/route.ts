import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { firstName, lastName, bio, phone, educationEntries, photos, specialties, businessName, businessAddress } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    const profileData = {
      firstName,
      lastName,
      bio,
      phone,
      photos: photos || [],
    };

    // Add baker-specific fields if user is a baker
    if (user?.role === 'BAKER') {
       //@ts-expect-error:fix
      profileData.bakerStatus = existingProfile?.bakerStatus || 'PENDING';
       //@ts-expect-error:fix
      profileData.specialties = specialties || [];
       //@ts-expect-error:fix
      profileData.businessName = businessName;
       //@ts-expect-error:fix
      profileData.businessAddress = businessAddress;
    }

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await prisma.profile.update({
        where: { userId: session.user.id },
        data: {
          ...profileData,
          education: {
            deleteMany: {},
             //@ts-expect-error:fix
            create: educationEntries?.map((edu) => ({
              universityName: edu.universityName,
              courseName: edu.courseName,
              graduationYear: edu.graduationYear,
            })) || [],
          },
        },
        include: {
          education: true,
        },
      });

      return NextResponse.json(
        { message: 'Profile updated successfully', profile: updatedProfile },
        { status: 200 }
      );
    } else {
      // Create new profile
      const profile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          ...profileData,
          education: {
             //@ts-expect-error:fix
            create: educationEntries?.map((edu) => ({
              universityName: edu.universityName,
              courseName: edu.courseName,
              graduationYear: edu.graduationYear,
            })) || [],
          },
        },
        include: {
          education: true,
        },
      });

      return NextResponse.json(
        { message: 'Profile created successfully', profile },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Profile submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving the profile' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        education: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the profile' },
      { status: 500 }
    );
  }
}

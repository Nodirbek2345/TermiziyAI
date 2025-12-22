import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// GET: Get current user details from DB
export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('admin_session');

        if (!sessionCookie) {
            return NextResponse.json(
                { authenticated: false, message: 'Session topilmadi' },
                { status: 401 }
            );
        }

        try {
            const sessionData = JSON.parse(sessionCookie.value);
            // Use Raw SQL to bypass Prisma Client validation (since client might be outdated in memory)
            const users = await prisma.$queryRaw<Array<any>>`
                SELECT id, name, surname, email, "phoneNumber", role, bio, image 
                FROM "User" 
                WHERE id = ${sessionData.userId}
            `;

            const user = users[0];

            if (!user) {
                return NextResponse.json(
                    { authenticated: false, message: 'Foydalanuvchi topilmadi' },
                    { status: 401 }
                );
            }

            return NextResponse.json({
                authenticated: true,
                user
            });
        } catch {
            return NextResponse.json(
                { authenticated: false, message: 'Session noto\'g\'ri' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { authenticated: false, error: 'Xatolik yuz berdi' },
            { status: 500 }
        );
    }
}

// PUT: Update user profile
export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('admin_session');

        if (!sessionCookie) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const sessionData = JSON.parse(sessionCookie.value);
        const body = await request.json();

        const { name, surname, email, phoneNumber, bio, image } = body;

        // Use Execute Raw for updates
        await prisma.$executeRaw`
            UPDATE "User" 
            SET name = ${name}, 
                surname = ${surname}, 
                email = ${email}, 
                "phoneNumber" = ${phoneNumber}, 
                bio = ${bio}, 
                image = ${image}
            WHERE id = ${sessionData.userId}
        `;

        // Return the updated data (echo back what we sent, as raw query return count)
        return NextResponse.json({
            success: true,
            user: { id: sessionData.userId, name, surname, email, phoneNumber, bio, image }
        });

    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

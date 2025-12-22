import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        console.log('Login attempt:', { email, password: '***' });

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Login (email yoki telefon) va parol kiritilishi shart' },
                { status: 400 }
            );
        }

        // Bazadan foydalanuvchini topish (raw SQL bilan barcha maydonlarni olish)
        const users = await prisma.$queryRaw<Array<{ id: number, email: string | null, phoneNumber: string | null, password: string | null, name: string, role: string, status: string }>>`
            SELECT "id", "email", "phoneNumber", "password", "name", "role", "status" 
            FROM "User" 
            WHERE "email" = ${email} OR "phoneNumber" = ${email} 
            LIMIT 1
        `;

        let user = users.length > 0 ? users[0] : null;

        console.log('User found:', user ? { id: user.id, email: user.email, role: user.role, hasPassword: !!user.password } : 'null');

        // Agar foydalanuvchi topilmasa va bu admin email bo'lsa, avtomatik yaratish
        if (!user && email === 'admin@termiziy.uz' && password === 'admin123') {
            await prisma.$executeRaw`
                INSERT INTO "User" ("email", "password", "name", "role", "status", "createdAt")
                VALUES ('admin@termiziy.uz', 'admin123', 'Admin', 'Admin', 'Active', NOW())
            `;
            const newUsers = await prisma.$queryRaw<Array<{ id: number, email: string | null, phoneNumber: string | null, password: string | null, name: string, role: string, status: string }>>`
                SELECT "id", "email", "phoneNumber", "password", "name", "role", "status" FROM "User" WHERE "email" = 'admin@termiziy.uz' LIMIT 1
            `;
            user = newUsers[0];
            console.log('Admin user created automatically');
        }

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Email yoki parol noto\'g\'ri' },
                { status: 401 }
            );
        }

        // Agar parol null bo'lsa, yangilash
        if (!user.password && password === 'admin123' && user.role === 'Admin') {
            await prisma.$executeRaw`UPDATE "User" SET "password" = 'admin123' WHERE "id" = ${user.id}`;
            user.password = 'admin123';
            console.log('Admin password set automatically');
        }

        // Parolni tekshirish
        if (user.password !== password) {
            console.log('Password mismatch:', { stored: user.password, provided: password });
            return NextResponse.json(
                { success: false, message: 'Email yoki parol noto\'g\'ri' },
                { status: 401 }
            );
        }

        // Faqat Admin rolini tekshirish
        if (user.role !== 'Admin') {
            return NextResponse.json(
                { success: false, message: 'Admin huquqi yo\'q' },
                { status: 403 }
            );
        }

        // Session cookie yaratish
        const sessionData = JSON.stringify({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });

        const cookieStore = await cookies();
        cookieStore.set('admin_session', sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 kun
            path: '/'
        });

        console.log('Login successful for:', user.email);

        return NextResponse.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Serverda xatolik yuz berdi', error: String(error) },
            { status: 500 }
        );
    }
}



import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, newPassword } = body;

        if (!email || !newPassword) {
            return NextResponse.json(
                { success: false, message: 'Email va yangi parol kiritilishi shart' },
                { status: 400 }
            );
        }

        // Foydalanuvchini topish
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Bu email bilan foydalanuvchi topilmadi' },
                { status: 404 }
            );
        }

        // Faqat Admin uchun parol tiklash
        if (user.role !== 'Admin') {
            return NextResponse.json(
                { success: false, message: 'Faqat Admin parolini tiklash mumkin' },
                { status: 403 }
            );
        }

        // Parolni yangilash (raw SQL orqali TypeScript xatosini oldini olish)
        await prisma.$executeRaw`UPDATE "User" SET "password" = ${newPassword} WHERE "id" = ${user.id}`;

        return NextResponse.json({
            success: true,
            message: 'Parol muvaffaqiyatli yangilandi'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { success: false, message: 'Serverda xatolik yuz berdi' },
            { status: 500 }
        );
    }
}


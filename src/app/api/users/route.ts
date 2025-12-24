import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Format date for frontend
        const formattedUsers = users.map((user) => ({
            ...user,
            date: user.createdAt.toISOString().split('T')[0]
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({
            error: 'Error fetching users',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name) {
            return NextResponse.json({ error: 'Ism kiritilmagan' }, { status: 400 });
        }

        if (!body.phoneNumber && !body.email) {
            return NextResponse.json({ error: 'Telefon yoki email kiritilmagan' }, { status: 400 });
        }

        // Build user data object
        const userData = {
            name: String(body.name),
            email: body.email ? String(body.email) : null,
            phoneNumber: body.phoneNumber ? String(body.phoneNumber) : null,
            role: body.role ? String(body.role) : 'Student',
            status: 'Active',
            message: body.message ? String(body.message) : null
        };

        const newUser = await prisma.user.create({
            data: userData as any
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating user:", error);

        const err = error as { code?: string; meta?: { target?: string[] } };

        // Check for unique constraint violation
        if (err?.code === 'P2002') {
            const field = err?.meta?.target?.[0] || 'field';
            return NextResponse.json({
                error: `Bu ${field === 'email' ? 'email' : 'telefon raqam'} allaqachon ro'yxatdan o'tgan`,
            }, { status: 409 });
        }

        return NextResponse.json({
            error: 'Foydalanuvchi yaratishda xatolik',
            details: error instanceof Error ? error.message : String(error),
        }, { status: 500 });
    }
}


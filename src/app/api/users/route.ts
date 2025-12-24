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
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        if (!body.phoneNumber && !body.email) {
            return NextResponse.json({ error: 'Phone or email is required' }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email || null,
                phoneNumber: body.phoneNumber || null,
                role: body.role || 'Student',
                status: 'Active',
                message: body.message || null
            }
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
        console.error("Error creating user:", error);

        // Check for unique constraint violation
        if (error?.code === 'P2002') {
            const field = error?.meta?.target?.[0] || 'field';
            return NextResponse.json({
                error: `Bu ${field === 'email' ? 'email' : 'telefon raqam'} allaqachon ro'yxatdan o'tgan`,
                details: 'Unique constraint violation'
            }, { status: 409 });
        }

        return NextResponse.json({
            error: 'Error creating user',
            details: error instanceof Error ? error.message : String(error),
            code: error?.code || 'UNKNOWN'
        }, { status: 500 });
    }
}

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
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            error: 'Error creating user',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

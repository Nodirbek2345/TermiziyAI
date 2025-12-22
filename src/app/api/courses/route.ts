import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({
            error: 'Error fetching courses',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newCourse = await prisma.course.create({
            data: {
                title: body.title,
                price: body.price,
                students: body.students || 0,
                rating: body.rating || 0,
                duration: body.duration,
                image: body.image
            }
        });
        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating course' }, { status: 500 });
    }
}

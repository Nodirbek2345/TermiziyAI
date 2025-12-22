import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }
        const course = await prisma.course.findUnique({
            where: { id }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching course' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const id = parseInt(params.id);
        const body = await request.json();

        const updatedCourse = await prisma.course.update({
            where: { id },
            data: {
                title: body.title,
                price: body.price,
                students: body.students,
                rating: body.rating,
                duration: body.duration,
                image: body.image
            }
        });

        return NextResponse.json(updatedCourse);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating course' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const id = parseInt(params.id);
        await prisma.course.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Course deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting course' }, { status: 500 });
    }
}

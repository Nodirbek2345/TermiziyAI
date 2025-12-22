import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const id = parseInt(params.id);
        const review = await prisma.review.findUnique({ where: { id } });
        if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(review);
    } catch (error) {
        return NextResponse.json({ error: 'Fetch error' }, { status: 500 });
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
        const updated = await prisma.review.update({
            where: { id },
            data: {
                name: body.name,
                role: body.role,
                content: body.content,
                rating: body.rating,
                image: body.image
            }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Update error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const id = parseInt(params.id);
        await prisma.review.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Delete error' }, { status: 500 });
    }
}

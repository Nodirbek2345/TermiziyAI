import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const graduates = await prisma.graduate.findMany({
            orderBy: { id: 'desc' }
        });
        return NextResponse.json(graduates);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch graduates' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newGraduate = await prisma.graduate.create({
            data: {
                name: body.name,
                company: body.company,
                story: body.story,
                image: body.image
            }
        });
        return NextResponse.json(newGraduate, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create graduate' }, { status: 500 });
    }
}

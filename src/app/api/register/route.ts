import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // TODO: Bu yerda ma'lumotlarni tekshirish va bazaga yozish logikasini qo'shing
        console.log('Foydalanuvchi ma\'lumotlari:', { name, email });

        // Muvaffaqiyatli javob qaytarish
        return NextResponse.json(
            { message: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi', success: true },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Xatolik yuz berdi', error: (error as Error).message },
            { status: 500 }
        );
    }
}

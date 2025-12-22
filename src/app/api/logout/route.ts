import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('admin_session');

        return NextResponse.json({
            success: true,
            message: 'Muvaffaqiyatli chiqildi'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Xatolik yuz berdi' },
            { status: 500 }
        );
    }
}

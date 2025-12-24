import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Foydalanuvchilar soni
        const totalUsers = await prisma.user.count();

        // Aktiv foydalanuvchilar soni
        const activeUsers = await prisma.user.count({
            where: { status: 'Active' }
        });

        // Kurslar soni
        const totalCourses = await prisma.course.count();

        // Bitiruvchilar soni
        const totalGraduates = await prisma.graduate.count();

        // Jami talabalar (barcha kurslardagi)
        const studentsAggregate = await prisma.course.aggregate({
            _sum: {
                students: true
            }
        });
        const totalStudents = studentsAggregate._sum.students || 0;

        // O'rtacha reyting
        const ratingAggregate = await prisma.course.aggregate({
            _avg: {
                rating: true
            }
        });
        const averageRating = ratingAggregate._avg.rating?.toFixed(1) || '0.0';

        return NextResponse.json({
            users: {
                total: totalUsers,
                active: activeUsers,
                trend: '+12%' // Bu keyinchalik hisoblash mumkin
            },
            courses: {
                total: totalCourses,
                students: totalStudents,
                averageRating: averageRating,
                trend: '+4'
            },
            graduates: {
                total: totalGraduates,
                trend: '+17%'
            },
            revenue: {
                total: '45.2M', // Bu hozircha statik
                trend: '+8%'
            },
            activity: {
                percentage: Math.round((activeUsers / totalUsers) * 100) || 0,
                trend: '+2%'
            }
        });
    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
    }
}

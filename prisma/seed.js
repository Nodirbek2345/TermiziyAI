require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({})

async function main() {
    // Admin User (for admin panel access)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@termiziy.uz' },
        update: { password: 'admin123' },
        create: {
            email: 'admin@termiziy.uz',
            password: 'admin123',
            name: 'Admin',
            role: 'Admin',
            status: 'Active',
        },
    })

    // Regular Users
    const user1 = await prisma.user.upsert({
        where: { email: 'ali@termiziy.ai' },
        update: {},
        create: {
            email: 'ali@termiziy.ai',
            name: 'Ali Valiyev',
            role: 'Student',
            status: 'Active',
        },
    })
    const user2 = await prisma.user.upsert({
        where: { email: 'vali@termiziy.ai' },
        update: { password: 'admin123', role: 'Admin' },
        create: {
            email: 'vali@termiziy.ai',
            password: 'admin123',
            name: 'Vali Aliyev',
            role: 'Admin',
            status: 'Active',
        },
    })

    // Courses
    const course1 = await prisma.course.create({
        data: {
            title: 'Python Asoslari',
            price: '500,000 UZS',
            students: 1240,
            rating: 4.8,
            duration: '24 soat',
            image: '/course-python.jpg'
        }
    })

    const course2 = await prisma.course.create({
        data: {
            title: 'Frontend (React)',
            price: '1,200,000 UZS',
            students: 850,
            rating: 4.9,
            duration: '36 soat',
            image: '/course-react.jpg'
        }
    })

    // Projects (Real Caselar)
    await prisma.project.createMany({
        data: [
            { title: 'Telegram Chatbot', description: 'Mijozlarga avtomatik javob beruvchi bot', category: 'ChatGPT', image: '/p1.jpg' },
            { title: 'Marketing Copy', description: 'Reklama matnlarini yozuvchi AI', category: 'ChatGPT', image: '/p2.jpg' },
            { title: 'Logo Design', description: 'Brending uchun logotiplar', category: 'Midjourney', image: '/p3.jpg' },
            { title: 'Interior Design', description: 'Uy interyeri dizaynlari', category: 'Midjourney', image: '/p4.jpg' },
            { title: 'Support Agent', description: '24/7 mijozlar xizmati agenti', category: 'Bot', image: '/p5.jpg' },
        ]
    })

    // Reviews (Hamjamiyat / Reviews)
    await prisma.review.createMany({
        data: [
            { name: 'Aziza Karimova', role: 'Student', content: 'Kurs juda tushunarli va foydali!', rating: 5 },
            { name: 'Bekzod Alimov', role: 'Developer', content: 'AIni o\'rganish uchun eng yaxshi platforma.', rating: 5 },
            { name: 'Dilorom Saidova', role: 'Designer', content: 'Midjourney darslari ajoyib!', rating: 5 },
        ]
    })

    // Graduates (Hamjamiyat / Alumni)
    await prisma.graduate.createMany({
        data: [
            { name: 'Jamshid Tursunov', company: 'Epam', story: 'Dasturchi bo\'lib ishga kirdim', image: '/g1.jpg' },
            { name: 'Malika Umarova', company: 'Upwork', story: 'Freelance orqali $1000 topyapman', image: '/g2.jpg' },
        ]
    })

    console.log({ admin, user1, user2, course1, course2 })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

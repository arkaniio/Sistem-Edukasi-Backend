"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('--- USERS ---');
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
        },
    });
    console.log(JSON.stringify(users, null, 2));
    console.log('--- STUDENTS ---');
    const students = await prisma.student.findMany({
        include: { class: true, user: true },
    });
    console.log(JSON.stringify(students, null, 2));
    console.log('--- ATTENDANCES ---');
    const attendances = await prisma.attendance.findMany({
        include: {
            student: { select: { firstName: true, lastName: true } },
            class: { select: { name: true } },
        },
    });
    console.log(JSON.stringify(attendances, null, 2));
    console.log('--- SUBJECTS ---');
    const subjects = await prisma.subject.findMany();
    console.log(JSON.stringify(subjects, null, 2));
    console.log('--- CLASSES ---');
    const classes = await prisma.class.findMany({
        include: {
            students: true,
            subjects: { include: { subject: true, teacher: true } },
        },
    });
    console.log(JSON.stringify(classes, null, 2));
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=check-data.js.map
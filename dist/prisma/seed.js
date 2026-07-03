"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
require("dotenv/config");
const prisma = new client_1.PrismaClient();
async function seedAdmin() {
    const email = process.env.ADMIN_GMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD?.trim();
    const firstName = process.env.ADMIN_FIRST_NAME?.trim() || 'Admin';
    const lastName = process.env.ADMIN_LAST_NAME?.trim() || 'User';
    if (!email || !password) {
        console.warn('ADMIN_GMAIL atau ADMIN_PASSWORD belum di-set — seed admin dilewati');
        return null;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.upsert({
        where: { email },
        update: {
            firstName,
            lastName,
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true,
        },
        create: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: 'ADMIN',
            isActive: true,
        },
    });
}
async function main() {
    await seedAdmin();
    const teacherPassword = await bcrypt.hash('app123', 10);
    const teacher = await prisma.user.upsert({
        where: { email: 'john@eduportal.com' },
        update: {},
        create: {
            firstName: 'John',
            lastName: 'Adebayo',
            email: 'john@eduportal.com',
            password: teacherPassword,
            role: 'TEACHER',
        },
    });
    const existingSubjects = await prisma.subject.count();
    if (existingSubjects === 0) {
        const subject1 = await prisma.subject.create({
            data: { name: 'Mathematics' },
        });
        const subject2 = await prisma.subject.create({
            data: { name: 'English Language' },
        });
        const class1 = await prisma.class.create({ data: { name: 'Primary 4A' } });
        const class2 = await prisma.class.create({ data: { name: 'Primary 4B' } });
        await prisma.classSubject.createMany({
            data: [
                { classId: class1.id, subjectId: subject1.id, teacherId: teacher.id },
                { classId: class2.id, subjectId: subject2.id, teacherId: teacher.id },
            ],
        });
        const qb = await prisma.questionBank.create({
            data: {
                title: 'Mathematics Mid-Term',
                subjectId: subject1.id,
                createdById: teacher.id,
            },
        });
        const q1 = await prisma.question.create({
            data: {
                question: 'What is 2+2?',
                type: 'MCQ',
                score: 1,
                hash: 'seed-hash-2plus2',
                questionBankId: qb.id,
                options: {
                    create: [
                        { label: 'A', text: '3', isCorrect: false },
                        { label: 'B', text: '4', isCorrect: true },
                        { label: 'C', text: '5', isCorrect: false },
                        { label: 'D', text: '6', isCorrect: false },
                    ],
                },
            },
        });
        const quiz = await prisma.quiz.create({
            data: {
                title: 'Mathematics Mid-Term Test',
                description: 'Test your math skills',
                timeLimit: 60,
                passingScore: 70,
                status: 'PUBLISHED',
                createdById: teacher.id,
            },
        });
        await prisma.quizQuestion.create({
            data: { quizId: quiz.id, questionId: q1.id },
        });
        await prisma.student.createMany({
            data: [
                { firstName: 'Alice', lastName: 'Smith', classId: class1.id },
                { firstName: 'Bob', lastName: 'Jones', classId: class1.id },
                { firstName: 'Charlie', lastName: 'Brown', classId: class2.id },
            ],
        });
    }
    console.log('Database seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
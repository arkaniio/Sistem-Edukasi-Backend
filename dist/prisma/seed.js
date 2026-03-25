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
const prisma = new client_1.PrismaClient();
async function main() {
    const password = await bcrypt.hash('app123', 10);
    const teacher = await prisma.user.upsert({
        where: { email: 'john@eduportal.com' },
        update: {},
        create: {
            firstName: 'John',
            lastName: 'Adebayo',
            email: 'john@eduportal.com',
            password,
            role: 'TEACHER',
        },
    });
    const subject1 = await prisma.subject.create({ data: { name: 'Mathematics' } });
    const subject2 = await prisma.subject.create({ data: { name: 'English Language' } });
    const class1 = await prisma.class.create({ data: { name: 'Primary 4A' } });
    const class2 = await prisma.class.create({ data: { name: 'Primary 4B' } });
    const cs1 = await prisma.classSubject.create({
        data: { classId: class1.id, subjectId: subject1.id, teacherId: teacher.id }
    });
    const cs2 = await prisma.classSubject.create({
        data: { classId: class2.id, subjectId: subject2.id, teacherId: teacher.id }
    });
    await prisma.cBTTest.create({
        data: {
            title: 'Mathematics Mid-Term Test',
            durationMins: 60,
            instructions: 'Answer all questions.',
            scheduledDate: new Date('2026-10-15T09:00:00Z'),
            status: 'ACTIVE',
            teacherId: teacher.id,
            classSubjectId: cs1.id,
            questions: {
                create: [
                    { question: 'What is 2+2?', options: ['3', '4', '5'], points: 1 }
                ]
            }
        }
    });
    await prisma.student.createMany({
        data: [
            { firstName: 'Alice', lastName: 'Smith', classId: class1.id },
            { firstName: 'Bob', lastName: 'Jones', classId: class1.id },
            { firstName: 'Charlie', lastName: 'Brown', classId: class2.id },
        ]
    });
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
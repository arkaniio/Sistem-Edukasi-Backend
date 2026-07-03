import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_GMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const firstName = process.env.ADMIN_FIRST_NAME?.trim() || 'Admin';
  const lastName = process.env.ADMIN_LAST_NAME?.trim() || 'User';

  if (!email || !password) {
    console.warn(
      'ADMIN_GMAIL atau ADMIN_PASSWORD belum di-set — seed admin dilewati',
    );
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

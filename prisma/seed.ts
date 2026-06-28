import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

  // seed test
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

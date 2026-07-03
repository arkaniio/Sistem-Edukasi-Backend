import { Test, TestingModule } from '@nestjs/testing';
import { ResultService } from './result.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ResultService', () => {
  let service: ResultService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultService,
        {
          provide: PrismaService,
          useValue: {
            quizAttempt: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ResultService>(ResultService);
    prisma = module.get(PrismaService);
  });

  it('returns a results array for frontend compatibility', async () => {
    prisma.quizAttempt.findMany.mockResolvedValueOnce([
      {
        id: 'attempt-1',
        isPassed: true,
        percentage: 80,
        score: 8,
        completedAt: new Date('2024-01-01T00:00:00.000Z'),
        quiz: { id: 'quiz-1', title: 'Quiz 1', subject: { name: 'Math' } },
        quizResult: { id: 'result-1' },
      },
    ]);

    const result = await service.getGradeReport('user-1');

    expect(result.results).toHaveLength(1);
    expect(result.recentAttempts).toHaveLength(1);
    expect(result.summary.totalQuizzes).toBe(1);
  });
});

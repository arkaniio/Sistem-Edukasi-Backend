import { Test, TestingModule } from '@nestjs/testing';
import { ResultsService } from './results.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ResultsService', () => {
  let service: ResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

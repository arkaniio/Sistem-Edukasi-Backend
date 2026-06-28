import { Test, TestingModule } from '@nestjs/testing';
import { StudentAnswerController } from './student-answer.controller';

describe('StudentAnswerController', () => {
  let controller: StudentAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentAnswerController],
    }).compile();

    controller = module.get<StudentAnswerController>(StudentAnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

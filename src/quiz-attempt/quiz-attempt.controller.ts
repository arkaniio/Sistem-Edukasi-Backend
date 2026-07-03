import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuizAttemptService } from './quiz-attempt.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('quiz-attempts')
@UseGuards(JwtAuthGuard)
export class QuizAttemptController {
  constructor(private readonly quizAttemptService: QuizAttemptService) {}

  @Post(':quizId/start')
  start(@Param('quizId') quizId: string, @CurrentUser() user: any) {
    return this.quizAttemptService.startAttempt(user.userId, quizId);
  }

  @Post(':attemptId/submit')
  submit(
    @Param('attemptId') attemptId: string,
    @Body()
    dto: {
      answers: {
        questionId: string;
        optionId?: string;
        essayAnswer?: string;
      }[];
    },
    @CurrentUser() user: any,
  ) {
    return this.quizAttemptService.submitAttempt(
      user.userId,
      attemptId,
      dto.answers,
    );
  }

  @Get('history')
  history(@CurrentUser() user: any, @Query('quizId') quizId?: string) {
    return this.quizAttemptService.getHistory(user.userId, quizId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.quizAttemptService.findById(id, user.userId);
  }
}

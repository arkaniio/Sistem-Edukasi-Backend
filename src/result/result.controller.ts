import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ResultService } from './result.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('results')
@UseGuards(JwtAuthGuard)
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get('quiz/:quizId')
  getQuizResults(@Param('quizId') quizId: string) {
    return this.resultService.getQuizResults(quizId);
  }

  @Get('student')
  getMyResults(@CurrentUser() user: any) {
    return this.resultService.getStudentResults(user.id);
  }

  @Get('student/grade-report')
  getGradeReport(@CurrentUser() user: any) {
    return this.resultService.getGradeReport(user.id);
  }
}

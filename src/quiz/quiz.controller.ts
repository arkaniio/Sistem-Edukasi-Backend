import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/role-user.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('subjectId') subjectId?: string,
    @Query('search') search?: string,
  ) {
    return this.quizService.findAll({ status, subjectId, search });
  }

  @Get('student')
  findForStudent(@CurrentUser() user: any) {
    return this.quizService.findForStudent(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  create(@Body() dto: any, @CurrentUser() user: any) {
    return this.quizService.create(user.userId, dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.quizService.update(id, dto);
  }

  @Post(':id/publish')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  publish(@Param('id') id: string) {
    return this.quizService.publish(id);
  }

  @Post(':id/close')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  close(@Param('id') id: string) {
    return this.quizService.close(id);
  }

  @Post(':id/questions')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  addQuestions(
    @Param('id') id: string,
    @Body() dto: { questionIds: string[] },
  ) {
    return this.quizService.addQuestions(id, dto.questionIds);
  }

  @Delete(':id/questions/:questionId')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  removeQuestion(
    @Param('id') id: string,
    @Param('questionId') questionId: string,
  ) {
    return this.quizService.removeQuestion(id, questionId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  remove(@Param('id') id: string) {
    return this.quizService.delete(id);
  }
}

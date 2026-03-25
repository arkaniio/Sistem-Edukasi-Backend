import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CbtService } from './cbt.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cbt')
export class CbtController {
  constructor(private readonly cbtService: CbtService) {}

  @Get()
  findAll(@Request() req: any) {
    if (req.user.role === 'STUDENT') {
      return this.cbtService.findForStudent(req.user.userId);
    }
    return this.cbtService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cbtService.findOne(id);
  }

  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.cbtService.create(req.user.userId, data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.cbtService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cbtService.remove(id);
  }

  @Post(':id/questions')
  addQuestion(@Param('id') id: string, @Body() data: any) {
    return this.cbtService.addQuestion(id, data);
  }

  @Patch('questions/:qid')
  updateQuestion(@Param('qid') qid: string, @Body() data: any) {
    return this.cbtService.updateQuestion(qid, data);
  }

  @Delete('questions/:qid')
  removeQuestion(@Param('qid') qid: string) {
    return this.cbtService.deleteQuestion(qid);
  }

  @Post(':id/start')
  startAttempt(@Request() req: any, @Param('id') id: string) {
    return this.cbtService.startAttempt(req.user.userId, id);
  }

  @Post('attempts/:aid/submit')
  submitAttempt(@Request() req: any, @Param('aid') aid: string, @Body() body: { answers: any }) {
    return this.cbtService.submitAttempt(req.user.userId, aid, body.answers);
  }

  @Get('attempts/test/:id')
  getAttempts(@Param('id') id: string) {
    return this.cbtService.getAttemptsByTest(id);
  }

  @Patch('attempts/:aid/grade')
  gradeAttempt(@Param('aid') aid: string, @Body() body: any) {
    return this.cbtService.updateAttemptGrade(aid, body);
  }
}

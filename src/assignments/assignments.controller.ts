import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private prisma: PrismaService
  ) {}

  @Get()
  findAll(@Request() req: any) {
    if (req.user.role === 'STUDENT') {
      return this.assignmentsService.findForStudent(req.user.userId);
    }
    return this.assignmentsService.findAll(req.user.userId);
  }

  @Get(':id/submissions')
  fetchSubmissions(@Param('id') id: string) {
    return this.assignmentsService.fetchSubmissions(id);
  }

  @Post(':id/submit')
  submitAssignment(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.assignmentsService.submitAssignment(req.user.userId, id, data);
  }

  @Patch('submissions/:submissionId/grade')
  gradeSubmission(@Param('submissionId') submissionId: string, @Body() data: any) {
    return this.assignmentsService.gradeSubmission(submissionId, data);
  }

  @Post()
  async create(@Body() data: any, @Request() req: any) {
    return this.assignmentsService.create({ 
      ...data, 
      teacherId: req.user.userId 
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.assignmentsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}

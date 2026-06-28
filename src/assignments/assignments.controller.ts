import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/role-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    if (user.role === 'STUDENT') {
      return await this.assignmentsService.findForStudent(user.userId);
    }
    return await this.assignmentsService.findAll(user.userId);
  }

  @Get(':id/submissions')
  async fetchSubmissions(@Param('id') id: string) {
    return await this.assignmentsService.fetchSubmissions(id);
  }

  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  @Post(':id/submit')
  async submitAssignment(
    @Param('id') id: string,
    @Body() data: SubmitAssignmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.assignmentsService.submitAssignment(
      user.userId,
      id,
      data,
    );
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @Patch('submissions/:submissionId/grade')
  async gradeSubmission(
    @Param('submissionId') submissionId: string,
    @Body() data: GradeSubmissionDto,
  ) {
    return await this.assignmentsService.gradeSubmission(submissionId, data);
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @Post()
  async create(
    @Body() data: CreateAssignmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.assignmentsService.create({
      ...data,
      teacherId: user.userId,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateAssignmentDto) {
    return await this.assignmentsService.update(id, data);
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.assignmentsService.remove(id);
  }
}

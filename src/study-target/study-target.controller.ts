import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { StudyTargetService } from './study-target.service';
import { CreateStudyTargetDto } from './dto/create-study-target.dto';

@UseGuards(JwtAuthGuard)
@Controller('study-targets')
export class StudyTargetController {
  constructor(private readonly studyTargetService: StudyTargetService) {}

  @Get()
  getTargets(@CurrentUser() user: AuthenticatedUser) {
    return this.studyTargetService.getTargets(user.userId);
  }

  @Post()
  createTarget(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateStudyTargetDto,
  ) {
    return this.studyTargetService.createTarget(user.userId, dto);
  }

  @Patch(':id/toggle')
  toggleTarget(@Param('id') id: string) {
    return this.studyTargetService.toggleTarget(id);
  }

  @Delete(':id')
  deleteTarget(@Param('id') id: string) {
    return this.studyTargetService.deleteTarget(id);
  }
}

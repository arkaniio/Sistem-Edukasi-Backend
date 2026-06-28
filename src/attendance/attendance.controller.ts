import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/role-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return await this.attendanceService.findAll(user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  @Post()
  async create(@Body() data: CreateAttendanceDto) {
    return await this.attendanceService.create(data);
  }

  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  @Post('student')
  async markAttendance(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: MarkAttendanceDto,
  ) {
    return await this.attendanceService.markStudentAttendance(
      user.userId,
      body?.status || 'PRESENT',
    );
  }
}

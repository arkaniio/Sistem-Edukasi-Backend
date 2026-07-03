import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/role-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('classId') classId?: string,
    @Query('date') date?: string,
    @Query('studentId') studentId?: string,
  ) {
    return await this.attendanceService.findAll(user.userId, {
      classId,
      date,
      studentId,
    });
  }

  @Get('student')
  async getStudentAttendance(
    @CurrentUser() user: AuthenticatedUser,
    @Query('classId') classId?: string,
    @Query('month') month?: string,
  ) {
    return await this.attendanceService.getStudentAttendance(
      user.userId,
      classId,
      month,
    );
  }

  @Get('summary')
  async getSummary(
    @Query('classId') classId: string,
    @Query('month') month?: string,
  ) {
    return await this.attendanceService.getSummary(classId, month);
  }

  @Get('stats')
  async getStats(
    @Query('classId') classId?: string,
    @Query('date') date?: string,
  ) {
    return await this.attendanceService.getStats(classId, date);
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @Post()
  async markAttendance(
    @Body()
    body: {
      classId: string;
      date: string;
      records: { studentId: string; status: any }[];
    },
  ) {
    return await this.attendanceService.markBulkAttendance(
      body.classId,
      body.date,
      body.records,
    );
  }

  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  @Post('student')
  async markStudentAttendance(
    @CurrentUser() user: AuthenticatedUser,
    @Body('status') status?: string,
  ) {
    return await this.attendanceService.markStudentAttendance(
      user.userId,
      status,
    );
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return await this.attendanceService.updateStatus(id, status);
  }
}

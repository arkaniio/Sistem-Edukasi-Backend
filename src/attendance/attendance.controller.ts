import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll(@Request() req: any) {
    if (req.user.role === 'STUDENT') {
      return this.attendanceService.findForStudent(req.user.userId);
    }
    return this.attendanceService.findAll(req.user.userId);
  }

  @Post()
  create(@Body() data: any) {
    return this.attendanceService.create(data);
  }

  @Post('student')
  markAttendance(@Request() req: any, @Body() body: { status?: string }) {
    return this.attendanceService.markStudentAttendance(req.user.userId, body?.status || 'PRESENT');
  }
}

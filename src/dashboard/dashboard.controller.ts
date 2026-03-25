import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary(@Request() req: any) {
    return this.dashboardService.getSummary(req.user.userId);
  }

  @Get('classes')
  async getClasses(@Request() req: any) {
    return this.dashboardService.getClasses(req.user.userId);
  }

  @Get('tasks')
  async getPendingTasks(@Request() req: any) {
    return this.dashboardService.getPendingTasks(req.user.userId);
  }

  @Get('student-summary')
  async getStudentSummary(@Request() req: any) {
    return this.dashboardService.getStudentSummary(req.user.userId);
  }

  @Get('export')
  async exportData(@Request() req: any) {
    return this.dashboardService.getExportData(req.user.userId);
  }
}

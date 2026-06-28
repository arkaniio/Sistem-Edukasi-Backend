import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/role-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary() {
    return await this.dashboardService.getSummary();
  }

  @Get('classes')
  async getClasses() {
    return await this.dashboardService.getClasses();
  }

  @Get('tasks')
  getPendingTasks() {
    return this.dashboardService.getPendingTasks();
  }

  @UseGuards(RolesGuard)
  @Roles('STUDENT')
  @Get('student-summary')
  async getStudentSummary(@CurrentUser() user: AuthenticatedUser) {
    return await this.dashboardService.getStudentSummary(user.userId);
  }

  @Get('export')
  async exportData() {
    return await this.dashboardService.getExportData();
  }
}

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MyClassesService } from './my-classes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/role-user.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('my-classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TEACHER')
export class MyClassesController {
  constructor(private readonly myClassesService: MyClassesService) {}

  @Get()
  getMyClasses(@CurrentUser() user: AuthenticatedUser) {
    return this.myClassesService.getMyClasses(user.userId);
  }

  @Post('enroll')
  enroll(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: { classId: string; subjectId: string },
  ) {
    return this.myClassesService.enroll(user.userId, dto.classId, dto.subjectId);
  }

  @Delete(':id')
  unenroll(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.myClassesService.unenroll(id, user.userId);
  }
}

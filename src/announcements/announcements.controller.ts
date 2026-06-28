import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/role-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.announcementsService.findAll(user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() data: CreateAnnouncementDto,
  ) {
    return this.announcementsService.create(user.userId, data);
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }
}

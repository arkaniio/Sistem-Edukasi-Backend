import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateResourceDto } from './dto/create-resource.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/role-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  getResources(@CurrentUser() user: AuthenticatedUser) {
    return this.resourcesService.getResources(user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createResource(
    @Body() body: CreateResourceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const dummyFileUrl = 'https://s3.aws.com/eduportal/dummy.pdf';
    return this.resourcesService.createResource(
      user.userId,
      body,
      dummyFileUrl,
    );
  }
}

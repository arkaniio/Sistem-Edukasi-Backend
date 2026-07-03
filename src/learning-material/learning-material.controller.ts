import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LearningMaterialService } from './learning-material.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/role-user.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('learning-materials')
@UseGuards(JwtAuthGuard)
export class LearningMaterialController {
  constructor(
    private readonly learningMaterialService: LearningMaterialService,
  ) {}

  @Get()
  findAll() {
    return this.learningMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningMaterialService.findById(id);
  }

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: { title: string; description?: string; classSubjectId?: string },
    @CurrentUser() user: any,
  ) {
    return this.learningMaterialService.upload(file, body, user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  remove(@Param('id') id: string) {
    return this.learningMaterialService.delete(id);
  }
}

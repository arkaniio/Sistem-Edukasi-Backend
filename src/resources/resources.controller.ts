import { Controller, Get, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(JwtAuthGuard)
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  async getResources(@Request() req: any) {
    return this.resourcesService.getResources(req.user.userId);
  }

  @Get('student')
  async getResourcesForStudent(@Request() req: any) {
    return this.resourcesService.getResourcesForStudent(req.user.userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/uploads/resources',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async createResource(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Request() req: any) {
    // Generate URL based on the saved file
    const fileUrl = `/uploads/resources/${file.filename}`;
    return this.resourcesService.createResource(req.user.userId, body, fileUrl);
  }
}

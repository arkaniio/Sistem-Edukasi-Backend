import { Controller, Get, Post, UseGuards, Request, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('recent')
  async getRecentResults(@Request() req: any) {
    return this.resultsService.getRecentResults(req.user.userId);
  }

  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: any, @Body() body: any, @Request() req: any) {
    return this.resultsService.processCsv(req.user.userId, body.classId, body.subjectId, file);
  }

  @Get('erapor')
  async getEraper(@Request() req: any) {
    return this.resultsService.getStudentEraper(req.user.userId);
  }
}

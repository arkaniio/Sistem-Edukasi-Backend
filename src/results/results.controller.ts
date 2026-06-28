import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UploadCsvDto } from './dto/upload-csv.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get('recent')
  async getRecentResults(@CurrentUser() user: AuthenticatedUser) {
    return await this.resultsService.getRecentResults(user.userId);
  }

  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @Body() body: UploadCsvDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.resultsService.processCsv(
      user.userId,
      body.classId,
      body.subjectId,
    );
  }

  @Get('erapor')
  async getEraper(@CurrentUser() user: AuthenticatedUser) {
    return await this.resultsService.getStudentEraper(user.userId);
  }
}

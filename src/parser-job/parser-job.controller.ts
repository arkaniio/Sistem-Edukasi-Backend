import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParserJobService } from './parser-job.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ParserStatus } from '@prisma/client';

@Controller('parser-jobs')
@UseGuards(JwtAuthGuard)
export class ParserJobController {
  constructor(private readonly parserJobService: ParserJobService) {}

  @Get()
  findAll(
    @Query('status') status?: ParserStatus,
    @CurrentUser() user?: any,
  ) {
    // Teachers and Admins can see jobs
    return this.parserJobService.findAll(status, user?.userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user?: any,
  ) {
    return this.parserJobService.findById(id, user?.userId);
  }

  @Post(':id/retry')
  retry(
    @Param('id') id: string,
    @CurrentUser() user?: any,
  ) {
    return this.parserJobService.retry(id, user?.userId);
  }
}

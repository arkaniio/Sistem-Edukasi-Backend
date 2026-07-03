import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get()
  async getTests(@Request() req: any) {
    return this.testsService.getTests(req.user.userId);
  }

  @Post()
  async createTest(@Body() body: any, @Request() req: any) {
    return this.testsService.createTest(req.user.userId, body);
  }
}

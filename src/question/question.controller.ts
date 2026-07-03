import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/role-user.decorator';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  findAll(
    @Query('questionBankId') questionBankId?: string,
    @Query('type') type?: string,
  ) {
    return this.questionService.findAll({ questionBankId, type });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.questionService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  remove(@Param('id') id: string) {
    return this.questionService.delete(id);
  }
}

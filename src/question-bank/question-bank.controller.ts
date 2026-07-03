import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionBankService } from './question-bank.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/role-user.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  CreateQuestionBankDto,
  UpdateQuestionBankDto,
  CreateQuestionDto,
} from './dto';

@Controller('question-banks')
@UseGuards(JwtAuthGuard)
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get()
  findAll(
    @Query('isDraft') isDraft?: string,
    @Query('subjectId') subjectId?: string,
    @Query('search') search?: string,
  ) {
    return this.questionBankService.findAll({
      isDraft: isDraft !== undefined ? isDraft === 'true' : undefined,
      subjectId,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionBankService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  create(@Body() dto: CreateQuestionBankDto, @CurrentUser() user: any) {
    return this.questionBankService.create(user.userId, dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateQuestionBankDto) {
    return this.questionBankService.update(id, dto);
  }

  @Post(':id/publish')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  publish(@Param('id') id: string) {
    return this.questionBankService.publish(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  remove(@Param('id') id: string) {
    return this.questionBankService.delete(id);
  }

  @Post(':id/questions')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  addQuestion(@Param('id') id: string, @Body() dto: CreateQuestionDto) {
    return this.questionBankService.addQuestion(id, dto);
  }
}

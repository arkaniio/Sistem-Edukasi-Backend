import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionBankDto } from './create-question-bank.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateQuestionBankDto extends PartialType(CreateQuestionBankDto) {
  @IsBoolean()
  @IsOptional()
  isDraft?: boolean;
}

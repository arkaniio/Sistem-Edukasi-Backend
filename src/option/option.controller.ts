import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OptionService } from './option.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-guard';
import { Roles } from '../auth/decorators/role-user.decorator';

@Controller('options')
@UseGuards(JwtAuthGuard)
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  create(@Body() dto: any) {
    return this.optionService.create(dto);
  }
}

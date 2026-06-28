import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/role-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  async findAll() {
    return await this.classesService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @Post()
  async create(@Body() data: CreateClassDto) {
    return await this.classesService.create(data);
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateClassDto) {
    return await this.classesService.update(id, data);
  }

  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.classesService.remove(id);
  }
}

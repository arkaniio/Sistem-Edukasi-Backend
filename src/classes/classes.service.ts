import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.class.findMany({
      include: { _count: { select: { students: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: CreateClassDto) {
    return await this.prisma.class.create({ data });
  }

  async update(id: string, data: UpdateClassDto) {
    return await this.prisma.class.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.prisma.class.delete({ where: { id } });
  }
}

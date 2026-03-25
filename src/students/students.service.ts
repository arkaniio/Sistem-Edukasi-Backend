import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any).student.findMany({ include: { class: true }, orderBy: { firstName: 'asc' } });
  }

  create(data: any) {
    return (this.prisma as any).student.create({ data });
  }

  update(id: string, data: any) {
    return (this.prisma as any).student.update({ where: { id }, data });
  }

  remove(id: string) {
    return (this.prisma as any).student.delete({ where: { id } });
  }
}

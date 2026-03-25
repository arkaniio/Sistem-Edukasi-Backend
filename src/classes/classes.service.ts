import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const data = await (this.prisma as any).class.findMany({ 
      include: { 
        _count: { select: { students: true } },
        subjects: {
          include: { 
            subject: true,
            teacher: { select: { id: true, firstName: true, email: true } }
          }
        }
      }, 
      orderBy: { name: 'asc' } 
    });
    console.log('[DEBUG] Classes found:', JSON.stringify(data, null, 2));
    return data;
  }

  create(data: any) {
    return (this.prisma as any).class.create({ data });
  }

  update(id: string, data: any) {
    return (this.prisma as any).class.update({ where: { id }, data });
  }

  remove(id: string) {
    return (this.prisma as any).class.delete({ where: { id } });
  }
}

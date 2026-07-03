import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: {
    questionId: string;
    label: string;
    text: string;
    isCorrect?: boolean;
  }) {
    return this.prisma.option.create({ data: dto });
  }
}

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { UpdateData } from '../tools/null-check-helper';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new UnauthorizedException('Invalid email!');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Failed to login, cant find password!');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async getPublicClasses() {
    return await this.prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = dto.role === 'STUDENT' ? 'STUDENT' : 'TEACHER';

    if (role === 'STUDENT' && !dto.classId) {
      throw new BadRequestException('Students must select a class');
    }

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        role: role,
        studentProfile:
          role === 'STUDENT'
            ? {
                create: {
                  firstName: dto.firstName,
                  lastName: dto.lastName,
                  classId: dto.classId!,
                },
              }
            : undefined,
      },
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    if (!userId) {
      throw new BadRequestException(
        'Session expired or invalid. Please log out and log back in.',
      );
    }

    const update_data = UpdateData(data);

    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: update_data,
      });

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getUserCount() {
    return await this.prisma.user.count();
  }
}

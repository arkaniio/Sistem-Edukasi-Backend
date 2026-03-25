import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(userDto: any) {
    const user = await this.prisma.user.findUnique({ where: { email: userDto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    const isPasswordValid = await bcrypt.compare(userDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: (user as any).avatar
      }
    };
  }

  async getPublicClasses() {
    return this.prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
  }

  async register(userDto: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: userDto.email } });
    if (existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const role = userDto.role === 'STUDENT' ? 'STUDENT' : 'TEACHER';

    if (role === 'STUDENT' && !userDto.classId) {
      throw new BadRequestException('Bagi siswa, Anda wajib memilih kelas Peminatan Fisika');
    }

    const user = await this.prisma.user.create({
      data: {
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        email: userDto.email,
        password: hashedPassword,
        role: role,
        studentProfile: role === 'STUDENT' ? {
          create: {
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            classId: userDto.classId
          }
        } : undefined
      }
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
        avatar: (user as any).avatar
      }
    };
  }

  async updateProfile(userId: string, data: any) {
    if (!userId) {
      throw new BadRequestException('Sesi kadaluarsa atau tidak valid. Harap Log Out dan Log In kembali.');
    }

    const updateData: any = {};
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.email) updateData.email = data.email;
    if (data.avatar) updateData.avatar = data.avatar;

    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: updateData
      });

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: (user as any).avatar
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email sudah digunakan oleh akun lain!');
      }
      if (error.code === 'P2025') {
        throw new BadRequestException('Akun tidak ditemukan di Database. Silakan Log Out dan Register ulang.');
      }
      throw new BadRequestException('Gagal menyimpan ke database (Validation Error). Pastikan file tidak rusak.');
    }
  }
  async getUserCount() {
    return this.prisma.user.count();
  }
}

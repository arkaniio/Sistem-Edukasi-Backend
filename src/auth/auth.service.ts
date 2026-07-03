import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
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
    private cloudinary: CloudinaryService,
  ) {}

  private buildTokenPair(user: { id: string; email: string; role: string }) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { access_token, refresh_token };
  }

  private formatUser(user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar: string | null;
    phone: string | null;
    isActive: boolean;

    createdAt: Date;
  }) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      isActive: user.isActive,

      createdAt: user.createdAt,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid email!');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Failed to login, invalid password!');
    }

    const { access_token, refresh_token } = this.buildTokenPair(user);
    return {
      access_token,
      refresh_token,
      expires_in: 900,
      user: this.formatUser(user),
    };
  }

  async getPublicClasses() {
    return await this.prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  async getUserCount() {
    return await this.prisma.user.count();
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
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

    const { access_token, refresh_token } = this.buildTokenPair(user);
    return {
      access_token,
      refresh_token,
      expires_in: 900,
      user: this.formatUser(user),
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        isActive: true,

        createdAt: true,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || !user.isActive)
        throw new UnauthorizedException('Invalid token');

      const { access_token, refresh_token } = this.buildTokenPair(user);
      return { access_token, refresh_token, expires_in: 900 };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout() {
    // Stateless JWT: simply acknowledge the logout.
    // For production, implement token blacklisting with Redis.
    return { message: 'Logged out successfully' };
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

      return this.formatUser(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Upload to Cloudinary
    const result = await this.cloudinary.uploadFile(file, 'avatars');
    const avatarUrl = result.secure_url;

    // Update user record
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    return this.formatUser(user);
  }
}

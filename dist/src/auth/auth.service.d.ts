import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private cloudinary;
    constructor(prisma: PrismaService, jwtService: JwtService, cloudinary: CloudinaryService);
    private buildTokenPair;
    private formatUser;
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            avatar: string | null;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
        };
    }>;
    getPublicClasses(): Promise<{
        id: string;
        name: string;
    }[]>;
    getUserCount(): Promise<number>;
    register(dto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            avatar: string | null;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.UserRole;
        avatar: string | null;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    refreshToken(token: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }>;
    logout(): Promise<{
        message: string;
    }>;
    updateProfile(userId: string, data: UpdateProfileDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        avatar: string | null;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        avatar: string | null;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
}

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            avatar: string | null;
        };
    }>;
    getPublicClasses(): Promise<{
        id: string;
        name: string;
    }[]>;
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            avatar: string | null;
        };
    }>;
    updateProfile(userId: string, data: UpdateProfileDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        avatar: string | null;
    }>;
    getUserCount(): Promise<number>;
}

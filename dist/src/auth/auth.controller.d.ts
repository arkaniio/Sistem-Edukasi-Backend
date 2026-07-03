import type { Request } from 'express';
import { AuthService } from './auth.service';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
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
    register(body: RegisterDto): Promise<{
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
    refresh(req: Request): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
    } | {
        statusCode: number;
        message: string;
    }>;
    logout(): Promise<{
        message: string;
    }>;
    getProfile(user: AuthenticatedUser): Promise<{
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
    updateProfile(user: AuthenticatedUser, body: UpdateProfileDto): Promise<{
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
    uploadAvatar(user: AuthenticatedUser, file: Express.Multer.File): Promise<{
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
    getPublicClasses(): Promise<{
        id: string;
        name: string;
    }[]>;
    getUserCount(): Promise<number>;
}

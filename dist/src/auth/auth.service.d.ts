import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(userDto: any): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            avatar: any;
        };
    }>;
    getPublicClasses(): Promise<{
        id: string;
        name: string;
    }[]>;
    register(userDto: any): Promise<{
        access_token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            avatar: any;
        };
    }>;
    updateProfile(userId: string, data: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        avatar: any;
    }>;
    getUserCount(): Promise<number>;
}

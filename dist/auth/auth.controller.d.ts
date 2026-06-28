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
    getUserCount(): Promise<number>;
    register(body: RegisterDto): Promise<{
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
    updateProfile(user: AuthenticatedUser, body: UpdateProfileDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        avatar: string | null;
    }>;
}

import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
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
    getUserCount(): Promise<number>;
    register(body: any): Promise<{
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
    updateProfile(req: any, body: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        avatar: any;
    }>;
}

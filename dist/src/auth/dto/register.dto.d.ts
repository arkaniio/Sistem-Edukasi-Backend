export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'STUDENT' | 'TEACHER';
    classId?: string;
}

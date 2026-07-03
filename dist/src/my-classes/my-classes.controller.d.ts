import { MyClassesService } from './my-classes.service';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
export declare class MyClassesController {
    private readonly myClassesService;
    constructor(myClassesService: MyClassesService);
    getMyClasses(user: AuthenticatedUser): Promise<({
        class: {
            _count: {
                students: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            level: string | null;
        };
        subject: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            description: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        classId: string;
        subjectId: string;
        teacherId: string;
    })[]>;
    enroll(user: AuthenticatedUser, dto: {
        classId: string;
        subjectId: string;
    }): Promise<{
        class: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            level: string | null;
        };
        subject: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            description: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        classId: string;
        subjectId: string;
        teacherId: string;
    }>;
    unenroll(user: AuthenticatedUser, id: string): Promise<{
        id: string;
        createdAt: Date;
        classId: string;
        subjectId: string;
        teacherId: string;
    }>;
}

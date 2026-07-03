import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    findAll(): Promise<({
        _count: {
            subjects: number;
            students: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        level: string | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            subjects: number;
            students: number;
        };
        subjects: ({
            subject: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
            };
            teacher: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            classId: string;
            subjectId: string;
            teacherId: string;
        })[];
        students: ({
            user: {
                id: string;
                email: string;
            } | null;
        } & {
            id: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
            updatedAt: Date;
            nisn: string | null;
            classId: string | null;
            userId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        level: string | null;
    }>;
    create(data: CreateClassDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        level: string | null;
    }>;
    update(id: string, data: UpdateClassDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        level: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        level: string | null;
    }>;
    addSubject(id: string, dto: {
        subjectId: string;
        teacherId: string;
    }): Promise<{
        subject: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string | null;
            description: string | null;
        };
        teacher: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        classId: string;
        subjectId: string;
        teacherId: string;
    }>;
    removeSubject(id: string, csId: string): Promise<{
        id: string;
        createdAt: Date;
        classId: string;
        subjectId: string;
        teacherId: string;
    }>;
    addStudent(id: string, studentId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        nisn: string | null;
        classId: string | null;
        userId: string | null;
    }>;
    removeStudent(id: string, sId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        nisn: string | null;
        classId: string | null;
        userId: string | null;
    }>;
}

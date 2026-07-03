import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params?: {
        classId?: string;
    }): Promise<({
        class: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            level: string | null;
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
    })[]>;
    create(data: CreateStudentDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        nisn: string | null;
        classId: string | null;
        userId: string | null;
    }>;
    update(id: string, data: UpdateStudentDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        nisn: string | null;
        classId: string | null;
        userId: string | null;
    }>;
    remove(id: string): Promise<{
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

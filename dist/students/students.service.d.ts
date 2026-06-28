import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        class: {
            id: string;
            name: string;
        };
    } & {
        firstName: string;
        lastName: string;
        classId: string;
        id: string;
        userId: string | null;
    })[]>;
    create(data: CreateStudentDto): Promise<{
        firstName: string;
        lastName: string;
        classId: string;
        id: string;
        userId: string | null;
    }>;
    update(id: string, data: UpdateStudentDto): Promise<{
        firstName: string;
        lastName: string;
        classId: string;
        id: string;
        userId: string | null;
    }>;
    remove(id: string): Promise<{
        firstName: string;
        lastName: string;
        classId: string;
        id: string;
        userId: string | null;
    }>;
}

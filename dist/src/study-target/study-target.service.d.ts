import { PrismaService } from '../prisma/prisma.service';
import { CreateStudyTargetDto } from './dto/create-study-target.dto';
export declare class StudyTargetService {
    private prisma;
    constructor(prisma: PrismaService);
    getTargets(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        description: string | null;
        title: string;
        period: import("@prisma/client").$Enums.StudyTargetPeriod;
        isCompleted: boolean;
    }[]>;
    createTarget(userId: string, dto: CreateStudyTargetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        description: string | null;
        title: string;
        period: import("@prisma/client").$Enums.StudyTargetPeriod;
        isCompleted: boolean;
    }>;
    toggleTarget(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        description: string | null;
        title: string;
        period: import("@prisma/client").$Enums.StudyTargetPeriod;
        isCompleted: boolean;
    }>;
    deleteTarget(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        description: string | null;
        title: string;
        period: import("@prisma/client").$Enums.StudyTargetPeriod;
        isCompleted: boolean;
    }>;
}

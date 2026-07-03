import { PrismaService } from '../prisma/prisma.service';
export declare class OptionService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: {
        questionId: string;
        label: string;
        text: string;
        isCorrect?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        text: string;
        isCorrect: boolean;
        questionId: string;
    }>;
}

import { PrismaService } from '../prisma/prisma.service';
export declare class TestsService {
    private prisma;
    constructor(prisma: PrismaService);
    getTests(teacherId: string): Promise<any>;
    createTest(teacherId: string, data: any): Promise<any>;
}

import { PrismaService } from '../prisma/prisma.service';
export declare class AnnouncementsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, role: string): Promise<any>;
    create(teacherId: string, data: any): Promise<any>;
    remove(id: string): Promise<any>;
}

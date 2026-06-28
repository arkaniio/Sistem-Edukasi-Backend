import { PrismaService } from '../prisma/prisma.service';
export declare class ResourcesService {
    private prisma;
    constructor(prisma: PrismaService);
    getResources(teacherId: string): Promise<any>;
    createResource(teacherId: string, data: any, fileUrl: string): Promise<any>;
    getResourcesByClassSubject(csId: string): Promise<any>;
    getResourcesForStudent(userId: string): Promise<any>;
}

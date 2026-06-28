import { PrismaService } from '../prisma/prisma.service';
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    create(data: any): any;
    update(id: string, data: any): any;
    remove(id: string): any;
}

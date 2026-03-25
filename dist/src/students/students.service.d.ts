import { PrismaService } from '../prisma/prisma.service';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    create(data: any): any;
    update(id: string, data: any): any;
    remove(id: string): any;
}

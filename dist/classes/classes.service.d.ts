import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            students: number;
        };
    } & {
        id: string;
        name: string;
    })[]>;
    create(data: CreateClassDto): Promise<{
        id: string;
        name: string;
    }>;
    update(id: string, data: UpdateClassDto): Promise<{
        id: string;
        name: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
    }>;
}

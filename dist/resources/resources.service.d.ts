import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
export declare class ResourcesService {
    private prisma;
    constructor(prisma: PrismaService);
    getResources(teacherId: string): Promise<({
        classSubject: {
            subject: {
                id: string;
                name: string;
            };
            class: {
                id: string;
                name: string;
            };
        } & {
            classId: string;
            id: string;
            subjectId: string;
            teacherId: string;
        };
    } & {
        id: string;
        teacherId: string;
        fileUrl: string;
        classSubjectId: string;
        title: string;
        description: string | null;
        type: string;
        accessLevel: string;
        downloads: number;
        createdAt: Date;
    })[]>;
    createResource(teacherId: string, data: CreateResourceDto, fileUrl: string): Promise<{
        id: string;
        teacherId: string;
        fileUrl: string;
        classSubjectId: string;
        title: string;
        description: string | null;
        type: string;
        accessLevel: string;
        downloads: number;
        createdAt: Date;
    }>;
    getResourcesByClassSubject(csId: string): Promise<({
        teacher: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        teacherId: string;
        fileUrl: string;
        classSubjectId: string;
        title: string;
        description: string | null;
        type: string;
        accessLevel: string;
        downloads: number;
        createdAt: Date;
    })[]>;
    getResourcesForStudent(userId: string): Promise<({
        classSubject: {
            subject: {
                id: string;
                name: string;
            };
        } & {
            classId: string;
            id: string;
            subjectId: string;
            teacherId: string;
        };
        teacher: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        teacherId: string;
        fileUrl: string;
        classSubjectId: string;
        title: string;
        description: string | null;
        type: string;
        accessLevel: string;
        downloads: number;
        createdAt: Date;
    })[]>;
}

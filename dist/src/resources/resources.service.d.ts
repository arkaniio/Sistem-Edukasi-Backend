import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class ResourcesService {
    private prisma;
    private cloudinary;
    constructor(prisma: PrismaService, cloudinary: CloudinaryService);
    getResources(teacherId: string): Promise<({
        classSubject: {
            class: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                level: string | null;
            };
            subject: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            classId: string;
            subjectId: string;
            teacherId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        type: string;
        fileUrl: string;
        classSubjectId: string;
        teacherId: string;
        downloads: number;
    })[]>;
    createResource(teacherId: string, data: CreateResourceDto, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        type: string;
        fileUrl: string;
        classSubjectId: string;
        teacherId: string;
        downloads: number;
    }>;
    getResourcesByClassSubject(csId: string): Promise<({
        teacher: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        type: string;
        fileUrl: string;
        classSubjectId: string;
        teacherId: string;
        downloads: number;
    })[]>;
    getResourcesForStudent(userId: string): Promise<({
        teacher: {
            firstName: string;
            lastName: string;
        };
        classSubject: {
            subject: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            classId: string;
            subjectId: string;
            teacherId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        type: string;
        fileUrl: string;
        classSubjectId: string;
        teacherId: string;
        downloads: number;
    })[]>;
    deleteResource(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        type: string;
        fileUrl: string;
        classSubjectId: string;
        teacherId: string;
        downloads: number;
    }>;
}

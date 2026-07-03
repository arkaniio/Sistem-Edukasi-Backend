import { ResourcesService } from './resources.service';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateResourceDto } from './dto/create-resource.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    getResources(user: AuthenticatedUser): Promise<({
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
    createResource(file: Express.Multer.File, body: CreateResourceDto, user: AuthenticatedUser): Promise<{
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

import { ResourcesService } from './resources.service';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateResourceDto } from './dto/create-resource.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    getResources(user: AuthenticatedUser): Promise<({
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
    createResource(body: CreateResourceDto, user: AuthenticatedUser): Promise<{
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
}

import { ResourcesService } from './resources.service';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    getResources(req: any): Promise<any>;
    getResourcesForStudent(req: any): Promise<any>;
    createResource(file: Express.Multer.File, body: any, req: any): Promise<any>;
}

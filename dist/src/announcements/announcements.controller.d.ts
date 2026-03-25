import { AnnouncementsService } from './announcements.service';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    findAll(req: any): Promise<any>;
    create(req: any, data: any): Promise<any>;
    remove(id: string): Promise<any>;
}

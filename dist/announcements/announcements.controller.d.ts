import { AnnouncementsService } from './announcements.service';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    findAll(user: AuthenticatedUser): Promise<({
        classSubject: ({
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
        }) | null;
        teacher: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        teacherId: string;
        content: string;
        classSubjectId: string | null;
        title: string;
        createdAt: Date;
    })[]>;
    create(user: AuthenticatedUser, data: CreateAnnouncementDto): Promise<{
        id: string;
        teacherId: string;
        content: string;
        classSubjectId: string | null;
        title: string;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        teacherId: string;
        content: string;
        classSubjectId: string | null;
        title: string;
        createdAt: Date;
    }>;
}

import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
export declare class AnnouncementsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<({
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
    create(teacherId: string, data: CreateAnnouncementDto): Promise<{
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

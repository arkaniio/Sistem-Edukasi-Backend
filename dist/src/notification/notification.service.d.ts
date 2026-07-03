import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: string;
        title: string;
        message: string;
        type?: string;
        link?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        link: string | null;
        title: string;
        type: string;
        message: string;
        isRead: boolean;
    }>;
    findAll(userId: string, unreadOnly?: boolean): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        link: string | null;
        title: string;
        type: string;
        message: string;
        isRead: boolean;
    }[]>;
    unreadCount(userId: string): Promise<{
        count: number;
    }>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        link: string | null;
        title: string;
        type: string;
        message: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}

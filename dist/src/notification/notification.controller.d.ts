import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAll(user: any, unreadOnly?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        link: string | null;
        title: string;
        type: string;
        message: string;
        isRead: boolean;
    }[]>;
    unreadCount(user: any): Promise<{
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
    markAllAsRead(user: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}

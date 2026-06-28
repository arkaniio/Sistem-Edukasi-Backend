import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getChatContacts(userId: string): Promise<any[]>;
    getMessagesWithUser(userId: string, otherUserId: string): Promise<any>;
    sendMessage(senderId: string, receiverId: string, content: string): Promise<any>;
    getAllUsers(userId: string): Promise<any>;
    getUnreadCount(userId: string): Promise<any>;
}

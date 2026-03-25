import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getUnreadCount(req: any): Promise<any>;
    getContacts(req: any): Promise<any[]>;
    getAllUsers(req: any): Promise<any>;
    getMessages(req: any, otherUserId: string): Promise<any>;
    sendMessage(req: any, body: {
        receiverId: string;
        content: string;
    }): Promise<any>;
}

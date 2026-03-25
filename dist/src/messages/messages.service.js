"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getChatContacts(userId) {
        const messages = await this.prisma.message.findMany({
            where: { OR: [{ senderId: userId }, { receiverId: userId }] },
            include: {
                sender: { select: { id: true, firstName: true, lastName: true, role: true } },
                receiver: { select: { id: true, firstName: true, lastName: true, role: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        const contactsMap = new Map();
        for (const m of messages) {
            const otherUser = m.senderId === userId ? m.receiver : m.sender;
            if (!contactsMap.has(otherUser.id)) {
                const unreadCount = await this.prisma.message.count({
                    where: {
                        senderId: otherUser.id,
                        receiverId: userId,
                        isRead: false
                    }
                });
                contactsMap.set(otherUser.id, {
                    user: otherUser,
                    lastMessage: m,
                    unreadCount
                });
            }
        }
        return Array.from(contactsMap.values());
    }
    async getMessagesWithUser(userId, otherUserId) {
        await this.prisma.message.updateMany({
            where: {
                senderId: otherUserId,
                receiverId: userId,
                isRead: false
            },
            data: { isRead: true }
        });
        return this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });
    }
    async sendMessage(senderId, receiverId, content) {
        return this.prisma.message.create({
            data: { senderId, receiverId, content }
        });
    }
    async getAllUsers(userId) {
        return this.prisma.user.findMany({
            where: { id: { not: userId } },
            select: { id: true, firstName: true, lastName: true, role: true }
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.message.count({
            where: {
                receiverId: userId,
                isRead: false
            }
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map
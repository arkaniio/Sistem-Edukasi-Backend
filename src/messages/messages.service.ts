import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getChatContacts(userId: string) {
    // Find all users this user has messaged or received messages from
    const messages = await (this.prisma as any).message.findMany({
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
        // Find unread count for ONLY this specific other user
        const unreadCount = await (this.prisma as any).message.count({
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

  async getMessagesWithUser(userId: string, otherUserId: string) {
    // Mark received messages from this user as read
    await (this.prisma as any).message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false
      },
      data: { isRead: true }
    });

    return (this.prisma as any).message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async sendMessage(senderId: string, receiverId: string, content: string) {
    return (this.prisma as any).message.create({
      data: { senderId, receiverId, content }
    });
  }

  async getAllUsers(userId: string) {
    return (this.prisma as any).user.findMany({
      where: { id: { not: userId } },
      select: { id: true, firstName: true, lastName: true, role: true }
    });
  }

  async getUnreadCount(userId: string) {
    return (this.prisma as any).message.count({
      where: {
        receiverId: userId,
        isRead: false
      }
    });
  }
}

import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('unread-count')
  getUnreadCount(@Request() req: any) {
    return this.messagesService.getUnreadCount(req.user.userId);
  }

  @Get('contacts')
  getContacts(@Request() req: any) {
    return this.messagesService.getChatContacts(req.user.userId);
  }

  @Get('users')
  getAllUsers(@Request() req: any) {
    return this.messagesService.getAllUsers(req.user.userId);
  }

  @Get(':otherUserId')
  getMessages(@Request() req: any, @Param('otherUserId') otherUserId: string) {
    return this.messagesService.getMessagesWithUser(req.user.userId, otherUserId);
  }

  @Post()
  sendMessage(@Request() req: any, @Body() body: { receiverId: string, content: string }) {
    return this.messagesService.sendMessage(req.user.userId, body.receiverId, body.content);
  }
}

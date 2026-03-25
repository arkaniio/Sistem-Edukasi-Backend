import { Controller, Post, Get, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Get('classes')
  async getPublicClasses() {
    return this.authService.getPublicClasses();
  }
  @Get('user-count')
  async getUserCount() {
    return this.authService.getUserCount();
  }
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  async updateProfile(@Request() req: any, @Body() body: any) {
    return this.authService.updateProfile(req.user.userId, body);
  }
}

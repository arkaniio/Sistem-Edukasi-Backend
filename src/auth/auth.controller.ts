import { Controller, Post, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Get('classes')
  async getPublicClasses() {
    return await this.authService.getPublicClasses();
  }

  @Get('user-count')
  async getUserCount() {
    return await this.authService.getUserCount();
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateProfileDto,
  ) {
    return await this.authService.updateProfile(user.userId, body);
  }
}

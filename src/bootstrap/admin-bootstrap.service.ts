import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(AdminBootstrapService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const email = process.env.ADMIN_GMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD?.trim();
    const firstName = process.env.ADMIN_FIRST_NAME?.trim() || 'Admin';
    const lastName = process.env.ADMIN_LAST_NAME?.trim() || 'User';

    if (!email || !password) {
      this.logger.warn(
        'ADMIN_GMAIL atau ADMIN_PASSWORD belum di-set — seed admin dilewati',
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.upsert({
      where: { email },
      update: {
        firstName,
        lastName,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
      create: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'ADMIN',
        isActive: true,
      },
    });

    this.logger.log(`Akun admin siap: ${email}`);
  }
}

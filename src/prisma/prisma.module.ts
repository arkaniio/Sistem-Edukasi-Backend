import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AdminBootstrapService } from '../bootstrap/admin-bootstrap.service';

@Global()
@Module({
  providers: [PrismaService, AdminBootstrapService],
  exports: [PrismaService],
})
export class PrismaModule {}

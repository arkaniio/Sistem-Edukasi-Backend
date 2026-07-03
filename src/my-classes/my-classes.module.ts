import { Module } from '@nestjs/common';
import { MyClassesController } from './my-classes.controller';
import { MyClassesService } from './my-classes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MyClassesController],
  providers: [MyClassesService],
})
export class MyClassesModule {}

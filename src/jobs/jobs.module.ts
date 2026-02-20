import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/redis/redis.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [PrismaModule, RedisModule, QueueModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}

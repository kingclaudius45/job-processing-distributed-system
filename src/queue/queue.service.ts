import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  private queue: Queue;

  constructor() {
    this.queue = new Queue('job-queue', {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: 'default',
        password: process.env.REDIS_PASSWORD,
      },
    });
  }

  async addJob(jobId: string) {
    await this.queue.add(
      'process-job',
      { jobId },
      {
        attempts: 3, // retry 3 times
        backoff: {
          type: 'exponential',
          delay: 2000, // 2 seconds
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}

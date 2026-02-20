import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './create-job.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobStatus } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';
import { QueueService } from 'src/queue/queue.service';
import { Logger } from '@nestjs/common';

export interface Status {
  status: string;
}

export interface Payload {
  payload: string;
}

export interface Job {
  id: string;
  task: string;
  status: string;
}

@Injectable()
export class JobsService {
  private jobs: Job[] = [];

  private readonly logger = new Logger(JobsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private queueService: QueueService,
  ) {}

  async createJob(dto: CreateJobDto) {
    const job = await this.prisma.job.create({
      data: { task: dto.task },
    });

    // Add to queue
    await this.queueService.addJob(job.id);
    this.logger.log('Job created successfully');

    return job;
  }

  async getAllJobs(status?: JobStatus) {
    return await this.prisma.job.findMany({
      where: status ? { status } : {},
    });
  }

  async getJobById(id: string) {
    const cacheKey = `job:${id}`;

    const cached = await this.redis.get(cacheKey);

    if (cached) {
      console.log('Cache hit');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(cached);
    }

    console.log('Cache miss');

    const job = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      this.logger.warn('Job failed');
      throw new NotFoundException('Job not found');
    }

    await this.redis.set(cacheKey, JSON.stringify(job), 100);

    return job;
  }

  async updateJobStatus(id: string, status: JobStatus) {
    const updatedJob = await this.prisma.job.update({
      where: { id },
      data: { status },
    });

    await this.redis.del(`job:${id}`);

    return updatedJob;
  }

  async deleteJob(id: string) {
    const deletedJob = await this.prisma.job.delete({
      where: { id },
    });

    await this.redis.del(`job:${id}`);

    return deletedJob;
  }

  async getJobStats() {
    const total = await this.prisma.job.count();

    const pending = await this.prisma.job.count({
      where: { status: 'PENDING' },
    });

    const completed = await this.prisma.job.count({
      where: { status: 'COMPLETED' },
    });

    const failed = await this.prisma.job.count({
      where: { status: 'FAILED' },
    });

    return {
      total,
      pending,
      completed,
      failed,
    };
  }
}

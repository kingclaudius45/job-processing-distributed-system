/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Delete, Patch } from '@nestjs/common';
import { Body, Post, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './create-job.dto';
import { UpdateJobStatusDto } from './update-job-status.dto';
import { Query } from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';

@ApiTags('Jobs')
@ApiBearerAuth() // 🔥 tells Swagger this needs JWT
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(@Body() dto: CreateJobDto) {
    return await this.jobsService.createJob(dto);
  }

  @ApiResponse({ status: 200, description: 'Get all jobs' })
  @Get()
  async getAllJobs(@Query('status') status?: JobStatus) {
    return await this.jobsService.getAllJobs(status);
  }

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return await this.jobsService.getJobById(id);
  }

  @Patch(':id/status')
  async updateJobStatus(
    @Param('id') id: string,
    @Body() dto: UpdateJobStatusDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await this.jobsService.updateJobStatus(id, dto.status);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return await this.jobsService.deleteJob(id);
  }

  @Get('stats')
  getStats() {
    return this.jobsService.getJobStats();
  }
}

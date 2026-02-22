import { IsEnum } from 'class-validator';
import { JobStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateJobStatusDto {
  @ApiProperty({ enum: JobStatus })
  @IsEnum(JobStatus)
  status: JobStatus;
}

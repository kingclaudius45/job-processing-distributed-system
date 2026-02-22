import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'Process image' })
  @IsString()
  @IsNotEmpty()
  task: string;
}

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Worker } from 'bullmq';
import { PrismaClient, JobStatus } from '@prisma/client';
import pino from 'pino';

const prisma = new PrismaClient();

async function addLog(jobId: string, message: string) {
  await prisma.jobLog.create({
    data: {
      jobId,
      message,
    },
  });
}

const worker = new Worker(
  'job-queue',
  async (job) => {
    const { jobId } = job.data as { jobId: string };

    const logger = pino();

    logger.info({ jobId }, 'Processing job');
    await addLog(jobId, 'Job picked by worker');

    await prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.IN_PROGRESS },
    });

    await addLog(jobId, 'Status updated to IN_PROGRESS');

    // Simulate random failure
    if (Math.random() < 0.4) {
      logger.warn({ jobId }, 'Job failed randomly');
      throw new Error('Simulated job failure');
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.COMPLETED },
    });

    await addLog(jobId, 'Job completed successfully');
    console.log(`Completed job ${jobId}`);
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      username: 'default',
      password: process.env.REDIS_PASSWORD,
    },
  },
);

// Handle permanent failure
worker.on('failed', async (job, err) => {
  if (!job) return;

  const jobId = job.data.jobId;

  console.log(
    `Job ${job.data.jobId} failed permanently with error: ${err.message}`,
  );

  await prisma.job.update({
    where: { id: jobId },
    data: { status: JobStatus.FAILED },
  });

  await addLog(jobId, `Job permanently failed: ${err.message}`);
});

console.log('Worker is running...');

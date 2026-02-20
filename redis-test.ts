import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: 'default',
  password: process.env.REDIS_PASSWORD,
});

async function test() {
  await redis.set('test-key', 'hello');
  const value = await redis.get('test-key');
  console.log(value);
  process.exit(0);
}

test();

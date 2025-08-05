import Redis from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.REDIS_HOST) {
  throw new Error('환경 변수 REDIS_HOST가 설정되지 않았습니다.');
}

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});

redisClient.on('connect', () => {
  console.log('Redis 연결 성공');
});

redisClient.on('error', (err) => {
  console.error('Redis 연결 오류:', err);
});

const publisher = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});

publisher.on('connect', () => {
    console.log('Redis Publisher 생성');
});

const subscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});

subscriber.on('connect', () => {
    console.log('Redis Subscriber 생성');
});

export { redisClient, publisher, subscriber };
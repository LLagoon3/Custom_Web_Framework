import { Request } from '../web_server/core/Request';
import { Redis } from 'ioredis';
import { redisClient, publisher, subscriber } from '../config/redis';

import { generateCacheKey } from './generateCacheKey';

class CacheClient {
    private publisher: Redis;
    private subscriber: Redis;
    private cacheClient: Redis;
    private ttl: number;

    constructor(publisher: Redis, subscriber: Redis, cacheClient: Redis, ttl = 60) {
        this.publisher = publisher;
        this.subscriber = subscriber;
        this.cacheClient = cacheClient;
        this.ttl = ttl;

        this.subscriber.on('message', this.deleteCache.bind(this));
    }

    public subscribe(channel: string) {
        this.subscriber.subscribe(channel);
    }

    public publish(channel: string, req: Request, key = null) {
        const cacheKey = generateCacheKey(req, key);
        this.publisher.publish(channel, cacheKey);
    }

    public async getCache(req: Request, key = null) {
        const cacheKey = generateCacheKey(req, key);
        const data = await this.cacheClient.get(cacheKey)
        return data;
    }

    public async setCache(req: Request, data: any, key = null) {
        const cacheKey = generateCacheKey(req, key);
        await this.cacheClient.setex(cacheKey, this.ttl, JSON.stringify(data));
    }

    private deleteCache(channel: string, cacheKey: string) {
        this.cacheClient.del(cacheKey);
    }
}

const cacheClient = new CacheClient(publisher, subscriber, redisClient);
export { cacheClient };
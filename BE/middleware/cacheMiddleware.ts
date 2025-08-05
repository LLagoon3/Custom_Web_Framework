import { redisClient } from "../config/redis";
import { MiddlewareFunction } from "../web_server/interfaces/middlewareFunction";
import { HttpError } from "../web_server/interfaces/HttpError";
import { generateCacheKey } from "../utill/generateCacheKey";
import { cacheClient } from "../utill/CacheClient";

export const cacheMiddleware: MiddlewareFunction = async (req, res, next) => {
    try {
        const data = await cacheClient.getCache(req);
        if (data) {
            res.send(data, 'application/json');
            return;
        }
        else {
            next();
        }
    } catch (error) {
        throw new HttpError(500, error.message);
    }
}
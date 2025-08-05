import { Request } from "../core/Request";
import { Response } from "../core/Response";
import { mimeTypes } from '../util/const';
import { MiddlewareFunction } from '../interfaces/middlewareFunction';
import { HttpError } from "../interfaces/HttpError";
import { redisClient } from "../../config/redis";
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';


export const staticRedisCacheMiddleware = (staticPath: string): MiddlewareFunction => {
    return async (req: Request, res: Response, next: Function) => {
        if (req.path === '/') {
            req.path = '/mainPage.html';
        }
        const filePath = path.join(staticPath, req.path);

        try {
            const cachedData = await redisClient.getBuffer(filePath);
            if (cachedData) {
                console.log('Cache hit');
                const ext = path.extname(filePath).toLowerCase();
                const contentType = mimeTypes[ext] || 'application/octet-stream';
                const decompressedData = zlib.gunzipSync(cachedData);
                // res.send(Buffer.from(cachedData, 'base64'), contentType);
                res.send(decompressedData, contentType);
                return;
            }

            const stats = await fs.promises.stat(filePath);
            if (!stats.isFile()) {
                console.log(`File not found: ${filePath}`);
                next();
            }

            const data = await fs.promises.readFile(filePath);
            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            const compressedData = zlib.gzipSync(data);
            await redisClient.setex(filePath, 10, compressedData);

            res.send(data, contentType);

        } catch (error) {
            if (error.code === 'ENOENT') {
                return next();
            }
            throw new HttpError(500, error.message);
        }
    };
};

import memoryCache from '../util/memoryCache';


export const staticMemoryCacheMiddleware = (staticPath: string) => {
  return async (req: Request, res: Response, next: Function) => {
    const filePath = path.join(staticPath, req.path === '/' ? '/mainPage.html' : req.path);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    try {
      // 캐시 조회
      const cachedEntry = memoryCache.get(filePath);
      if (cachedEntry) {
        res.setHeader('Content-Type', cachedEntry.contentType);
        return res.send(cachedEntry.value, contentType);
      }

      // 파일이 없으면 캐시 및 응답 처리
      const stats = await fs.promises.stat(filePath);
      if (!stats.isFile()) {
        console.log(`File not found: ${filePath}`);
        return next();
      }

      const data = await fs.promises.readFile(filePath);

      // 메모리 캐시에 저장
      memoryCache.set(filePath, data, contentType, 60000);

      res.setHeader('Content-Type', contentType);
      res.send(data, contentType);

    } catch (error) {
      if (error.code === 'ENOENT') {
        return next();
      }
      throw new HttpError(500, error.message);
    }
  };
};
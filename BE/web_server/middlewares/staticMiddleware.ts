import { Request } from "../core/Request";
import { Response } from "../core/Response";
import { mimeTypes } from '../util/const';
import { MiddlewareFunction } from '../interfaces/middlewareFunction';
import { HttpError } from "../interfaces/HttpError";
import * as fs from 'fs';
import * as path from 'path';


export const staticMiddleware = (staticPath: string): MiddlewareFunction => {
    return (req: Request, res: Response, next: Function) => {
        // console.log(`[Middleware]: Static middleware: ${req.path}`);

        if (req.path === '/') {
            req.path = '/mainPage.html';
        }
        const filePath = path.join(staticPath, req.path);
        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                console.log(`File not found: ${filePath}`);
                next();
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    throw new HttpError(500, err.message);
                }

                res.send(data, contentType);
                next();
            });
        });
            
        // try {
        //     const readStream = fs.createReadStream(filePath);
        //     readStream.pipe(res);
        // } catch (error) {
        //     console.error(`Error in static middleware: ${error.message}`);
        //     res.sendFile(path.join(staticPath, '404.html'));
        // }
    };
}


import { Request } from "../web_server/core/Request";
import { Response } from "../web_server/core/Response";
import { HttpError } from "../web_server/interfaces/HttpError";
import { staticPath } from "../app";
import { ErrorMiddlewareFunction } from "../web_server/interfaces/middlewareFunction";

import * as path from 'path';
import * as fs from 'fs';



export const ErrorHandleMiddleware: ErrorMiddlewareFunction = (err: HttpError, req: Request, res: Response, next: Function) => {
    console.error(`Error: ${err.status} - ${err.message}`);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    if (req.accepts('json')) {
        return res.status(status).json({ 
            error: { 
                message, 
                status 
            } 
        });
    }

    const filePath = path.join(staticPath, 'errorpages', `error${status}.html`);
    try {
        if (fs.existsSync(filePath)) {
            res.status(status);
            res.sendFile(filePath);
        }

        res.status(404).sendFile(path.join(staticPath, 'errorPage.html'));
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}
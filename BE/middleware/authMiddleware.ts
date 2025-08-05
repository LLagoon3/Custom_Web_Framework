import { Request } from "../web_server/core/Request";
import { Response } from "../web_server/core/Response";
import { HttpError } from "../web_server/interfaces/HttpError";
import { MiddlewareFunction } from "../web_server/interfaces/middlewareFunction";
import { staticPath } from "../app";
import * as path from 'path';

export const authMiddleware = (role: 'user' | 'admin'): MiddlewareFunction => {
    return (req: Request, res: Response, next: Function) => {
        if (req.session.user && req.session.user.role === role) {
            next();
        } else {
            const error = new HttpError(403);
            next(error);    
        }
    };
};

import { Request } from "./Request";
import { Response } from "./Response";
import { HttpError } from "../interfaces/HttpError";
import { Router } from './Router';
import { MiddlewareFunction, ErrorMiddlewareFunction, isErrorMiddleware } from '../interfaces/middlewareFunction';


export class MiddlewareHandler {
    static handle(
        req: Request, 
        res: Response, 
        middlewares: Array<{ path: string, middleware: MiddlewareFunction | ErrorMiddlewareFunction | Router }>, 
        router: Router
    ) {
        if (res.finished) return;
        const originalPath = req.path;

        const next = (err?: HttpError) => {
            req.path = originalPath;
            if (middlewares.length === 0) {
                if (!res.finished) router.handle(req, res, next);
                return;
            }

            const { path, middleware } = middlewares.shift()!;
            // console.log(middlewares.length, '   path:', req.path, '    middleware:', path, '    res.finished:', res.finished);

            if (path !== '*' && !MiddlewareHandler.matchRoute(req, path)) {
                next(err); // 경로가 맞지 않으면 다음 미들웨어로 이동
                return;
            }

            req.path = req.path.replace(path, '');

            try {
                if (err) {
                    if (isErrorMiddleware(middleware)) {
                        (middleware as ErrorMiddlewareFunction)(err, req, res, next); // 에러 미들웨어 실행
                    } else {
                        next(err);
                    }
                } else {
                    if (!isErrorMiddleware(middleware)) {
                        if (middleware instanceof Router) {
                            middleware.handle(req, res, next); // 라우터 실행
                        } else {
                            (middleware as MiddlewareFunction)(req, res, next); // 미들웨어 실행
                        }
                    }
                }
            } catch (error) {
                next(error);
            }
        };

        next(); // 첫 번째 미들웨어 실행
    }

    static matchRoute(req: Request, path: string) {
        if (path === '/' && req.path[0] === '/') return true;
        const [_, primaryPath] = req.path.split('/');
        return '/' + primaryPath === path;
    }
}

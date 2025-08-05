import { Request } from './Request';
import { Response } from './Response';
import { HttpError } from "../interfaces/HttpError";
import { RouteHandler } from '../interfaces/routerHandler';
import { MiddlewareFunction } from '../interfaces/middlewareFunction';

interface Route {
    method: string;
    path: string;
    handler: MiddlewareFunction[];
    regexPath?: RegExp | null;
    paramNames?: string[];
}

export class Router {
    private routes: Route[] = [];
    private middlewares: MiddlewareFunction[] = [];

    use(middleware: MiddlewareFunction) {
        this.middlewares.push(middleware);
    }

    addRoute(method: string, path: string, handler: MiddlewareFunction[]) {
        const isDynamic = path.includes(':');
        let regexPath: RegExp | null = null;
        let paramNames: string[] = [];

        if (isDynamic) {
        const regex = path.replace(/:([^/]+)/g, (_, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });
        regexPath = new RegExp(`^${regex}$`);
        }

        this.routes.push({ method, path, handler, regexPath, paramNames });
    }

    get(path: string, ...handler: MiddlewareFunction[]) {
        this.addRoute('GET', path, handler);
    }

    post(path: string, ...handler: MiddlewareFunction[]) {
        this.addRoute('POST', path, handler);
    }

    put(path: string, ...handler: MiddlewareFunction[]) {
        this.addRoute('PUT', path, handler);
    }

    patch(path: string, ...handler: MiddlewareFunction[]) {
        this.addRoute('PATCH', path, handler);
    }

    delete(path: string, ...handler: MiddlewareFunction[]) {
        this.addRoute('DELETE', path, handler);
    }

    handleMiddleware(req: Request, res: Response, middlewares: Array<MiddlewareFunction>) { 
        const next = (err?: Error) => {
            if (res.finished) return;
            else if (err) {
                const error = err instanceof HttpError ? err : new HttpError(500, err.message);
                throw error;
            }

            const handler = middlewares.shift();
            if (handler) {
                Promise.resolve(handler(req, res, next)).catch(next);
            }
            else {
                return;
            }
        };

        next();
    }

    handle(req: Request, res: Response, next: Function) {
        try {
            // 정적 라우트 처리
            let route = this.routes.find(
                r => r.method === req.method && r.path === req.path && !r.regexPath
            );

            // 동적 라우트 처리
            if (!route) {
                route = this.routes.find(r => {
                    if (!r.regexPath || r.method !== req.method) return false;
                    const match = req.path.match(r.regexPath);
                    if (match) {
                        req.params = {};
                        r.paramNames?.forEach((name, index) => {
                            req.params[name] = match[index + 1];
                        });
                        return true;
                    }
                    return false;
                });
            }

            if (!route) {
                res.statusCode = 404;
                return res.end();
            }

            // 라우터 수준 미들웨어 처리
            this.handleMiddleware(req, res, [...this.middlewares]);

            // 특정 경로에 대한 미들웨어 처리  
            this.handleMiddleware(req, res, [...route.handler]);
        }
        catch (error) {
            next(error);
        }
    }
}

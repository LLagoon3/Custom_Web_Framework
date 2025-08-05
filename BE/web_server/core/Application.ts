
import { Server } from './Server';
import { Router } from './Router';
import { Request } from './Request';
import { Response } from './Response';
import { MiddlewareHandler } from './Middleware';

// interface
import { RouteHandler } from '../interfaces/routerHandler';
import { MiddlewareFunction, ErrorMiddlewareFunction } from '../interfaces/middlewareFunction';
import { EventEmitter } from 'events';

export class Application extends EventEmitter{
    private server: Server;
    private router: Router;
    private middlewares: Array<{ path: string, middleware: MiddlewareFunction | ErrorMiddlewareFunction | Router }>;

    constructor() {
        super();
        this.router = new Router();
        this.server = new Server(this);
        this.middlewares = [];
    }

    use(pathOrMiddleware: string | MiddlewareFunction | ErrorMiddlewareFunction, maybeRouterOrMiddleware?: Router | MiddlewareFunction | ErrorMiddlewareFunction) {
        // 첫 번째 인자가 문자열일 경우 -> path와 router
        if (typeof pathOrMiddleware === 'string' && maybeRouterOrMiddleware) {
        this.middlewares.push({ 'path': pathOrMiddleware, 'middleware': maybeRouterOrMiddleware });
        }
        // 첫 번째 인자가 미들웨어 함수일 경우 -> 전역 미들웨어
        else if (typeof pathOrMiddleware === 'function') {
        this.middlewares.push({ 'path': '*', 'middleware': pathOrMiddleware });
        }
    }

  // 미들웨어와 라우터 실행
    async handle(req: Request, res: Response) {
        MiddlewareHandler.handle(req, res, [...this.middlewares], this.router);
    }

    get(path: string, ...handler: MiddlewareFunction[]) {
        this.router.addRoute('GET', path, handler);
    }

    post(path: string, ...handler: MiddlewareFunction[]) {
        this.router.addRoute('POST', path, handler);
    }

    listen(port: number, callback?: () => void) {
        this.server.listen(port, callback);
    }
}

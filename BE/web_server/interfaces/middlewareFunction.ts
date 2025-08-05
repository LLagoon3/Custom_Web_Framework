import { Request } from "../core/Request";
import { Response } from "../core/Response";

export type MiddlewareFunction = (req: Request, res: Response, next?: Function) => void | Promise<void>;

export type ErrorMiddlewareFunction = (err: any, req: Request, res: Response, next?: Function) => void;

export const isErrorMiddleware = (middleware: any): middleware is ErrorMiddlewareFunction => {
    return middleware.length === 4;
}
import { Request } from "../core/Request";
import { Response } from "../core/Response";
import { MiddlewareFunction } from '../interfaces/middlewareFunction';

const parseUrlEncoded = (queryString: string) => {
    const result: { [key: string]: string } = {};
    const pairs = queryString.split('&');

    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        // decodeURIComponent: URL 인코딩된 문자열을 디코딩, 빌트인 함수
        result[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    return result;
}


export const bodyParseMiddleware: MiddlewareFunction = (req: Request, res: Response, next: Function) => {
    const reqContentType = req.headers['Content-Type'];

    if (req.body || !['application/json',
        'application/x-www-form-urlencoded',].includes(reqContentType)
    ) next();

    let dataBuffer = Buffer.alloc(0); 

    req.on('end', () => {
        if (reqContentType === 'application/json') {
            req.body = JSON.parse(dataBuffer.toString());
        }
        else if (reqContentType === 'application/x-www-form-urlencoded') {
            req.body = parseUrlEncoded(dataBuffer.toString());
        }
        next();
    });

    req.on('data', (chunk) => {
        dataBuffer = Buffer.concat([dataBuffer, chunk]);
    });
};
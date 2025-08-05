import { Request } from "../web_server/core/Request";

export const generateCacheKey = (req: Request, key = null): string => {
    const params = Object.keys(req.params).map(key => `${key}=${req.params[key]}`).join('&');
    return key ? key : `${req.method}:${req.path}:${params}`;
};
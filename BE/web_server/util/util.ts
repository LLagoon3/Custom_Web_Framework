import { Request } from "../core/Request";
import { Response } from "../core/Response";

export const clearAllCookies = (req: Request, res: Response) => {
    const cookies = req.cookies;
    Object.keys(cookies).forEach(key => res.clearCookie(key));
}
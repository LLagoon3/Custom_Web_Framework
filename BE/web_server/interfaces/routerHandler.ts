import { Request } from "../core/Request";
import { Response } from "../core/Response";

export type RouteHandler = (req: Request, res: Response) => void | Promise<void>;

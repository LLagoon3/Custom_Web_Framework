import { Router } from "../web_server/core/Router";
import { authMiddleware } from "../middleware/authMiddleware";
import { cacheMiddleware } from "../middleware/cacheMiddleware";
import {
    getImage,
    createImage
} from "../controller/imageController";


const imageRouter = new Router();

imageRouter.get('/:postId', cacheMiddleware, getImage);

imageRouter.post('/upload/:postId', authMiddleware('user'), createImage);

export default imageRouter;
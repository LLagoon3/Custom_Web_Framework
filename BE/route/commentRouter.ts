import { Router } from "../web_server/core/Router";
import { authMiddleware } from "../middleware/authMiddleware";
import { cacheMiddleware } from "../middleware/cacheMiddleware";
import {
    getCommentsByPostId,
    createComment,
    deleteComment
} from "../controller/commentController";

const commentRouter = new Router();

commentRouter.get('/:postId', cacheMiddleware, getCommentsByPostId);

commentRouter.post('/:postId', authMiddleware('user'), createComment);

commentRouter.delete('/:commentId', authMiddleware('user'), deleteComment);

export default commentRouter;
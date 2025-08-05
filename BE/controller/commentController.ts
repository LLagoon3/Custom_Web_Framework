import { Request } from "../web_server/core/Request";
import { Response } from "../web_server/core/Response";
import { MiddlewareFunction } from "../web_server/interfaces/middlewareFunction";
import { CommentDao } from "../dao/CommentDao";
import { Comment } from "../model/Comment";
import { cacheClient } from "../utill/CacheClient";

const CHANNEL = 'comment';
cacheClient.subscribe(CHANNEL);


export const getCommentById: MiddlewareFunction = async (req: Request, res: Response) => {
    const commentDao = new CommentDao(req.dbConnection);
    const comments = await commentDao.findById(parseInt(req.params.commentId));

    res.json(comments);
}

export const getCommentsByPostId: MiddlewareFunction = async (req: Request, res: Response) => {
    const commentDao = new CommentDao(req.dbConnection);
    const comments = await commentDao.findByPostId(parseInt(req.params.postId));

    cacheClient.setCache(req, comments);
    res.json(comments);
}

export const createComment: MiddlewareFunction = async (req: Request, res: Response) => {
    const commentDao = new CommentDao(req.dbConnection);
    const comment = new Comment({
        post_id: req.params.postId,
        author: req.session.user.id,
        content: req.body.content,
    });

    commentDao.create(comment);
    cacheClient.publish(CHANNEL, req);
    res.json(comment);
}

export const deleteComment: MiddlewareFunction = async (req: Request, res: Response) => {
    const commentDao = new CommentDao(req.dbConnection);
    const targetComment = await commentDao.findById(parseInt(req.params.commentId));
    if (req.session.user.id !== targetComment.author) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    commentDao.delete(parseInt(req.params.commentId));
    cacheClient.publish(CHANNEL, req);
    res.status(204).end();
}

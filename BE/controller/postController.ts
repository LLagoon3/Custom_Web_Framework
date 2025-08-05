import { Request } from "../web_server/core/Request";
import { Response } from "../web_server/core/Response";
import { RouteHandler } from "../web_server/interfaces/routerHandler";
import { MiddlewareFunction } from "../web_server/interfaces/middlewareFunction";
import { HttpError } from "../web_server/interfaces/HttpError";
import { PostDao } from "../dao/PostDao";
import { Post } from "../model/Post";
import { redisClient } from "../config/redis";
import { cacheClient } from "../utill/CacheClient";

const VIEW_COUNT_UPDATE_THRESHOLD = 3;
const CHANNEL = 'post';

cacheClient.subscribe(CHANNEL);


export const getPostsByPage: MiddlewareFunction = async (req: Request, res: Response) => {
    const postDao = new PostDao(req.dbConnection);
    const posts = await postDao.findByPage(parseInt(req.params.page));

    const postViewCounts = await Promise.all(posts.map(async (post) => {
        const viewCount = await redisClient.hget('post_view_count', String(post.id));
        post.view_count = viewCount ? parseInt(viewCount) : 0;
        return post;
    }));

    res.json(postViewCounts);
};


export const getPostById: MiddlewareFunction = async (req: Request, res: Response) => {
    const postDao = new PostDao(req.dbConnection);
    const post = await postDao.findById(parseInt(req.params.id));

    await redisClient.hsetnx('post_view_count', String(req.params.id), String(post.view_count || 0));
    
    const viewCount = await redisClient.hincrby('post_view_count', String(req.params.id), 1);
    if (viewCount - post.view_count > VIEW_COUNT_UPDATE_THRESHOLD) await postDao.update(new Post({ id: req.params.id, view_count: viewCount }));
    
    post.view_count = viewCount;

    cacheClient.setCache(req, post);
    res.json(post);
}

export const getPageByPostId: MiddlewareFunction = async (req: Request, res: Response) => {
    const postDao = new PostDao(req.dbConnection);
    const pageNumber = await postDao.findPageById(parseInt(req.params.postId));

    res.json({ pageNumber });
}

export const getPrevAndNextPostId: MiddlewareFunction = async (req: Request, res: Response) => {
    const postDao = new PostDao(req.dbConnection);
    const { prevPostId, nextPostId } = await postDao.findPrevAndNextPostId(parseInt(req.params.postId));

    res.json({ prevPostId, nextPostId });
}

export const createPost: MiddlewareFunction = async (req: Request, res: Response) => {
    const postDao = new PostDao(req.dbConnection);
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.session.user.id
    });

    const postId = await postDao.create(post);

    res.status(201).json({ postId });
}

export const updatePost: MiddlewareFunction = async (req: Request, res: Response) => {
    const postDao = new PostDao(req.dbConnection);

    const targetPost = await postDao.findById(parseInt(req.params.id));
    if (targetPost.author !== req.session.user.id) {
        throw new HttpError(403);
    }

    const post = new Post({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.session.user.id
    });

    await postDao.update(post);
    cacheClient.publish(CHANNEL, req);
    res.json(post);
}

export const deletePost: MiddlewareFunction = async (req: Request, res: Response) => {
    const postDao = new PostDao(req.dbConnection);
    const targetPost = await postDao.findById(parseInt(req.params.id));
    if (targetPost.author !== req.session.user.id) {
        throw new HttpError(403);
    }

    await postDao.delete(parseInt(req.params.id));
    cacheClient.publish(CHANNEL, req);
    res.status(204).end();
}

export const getSearchByKeyword: MiddlewareFunction = async (req: Request, res: Response) => {
    const postDao = new PostDao(req.dbConnection);
    const posts = await postDao.searchByKeyword(req.query.search as string);

    res.json(posts);
}

export const getCountPosts: MiddlewareFunction = async (req: Request, res: Response) => {
    const postDao = new PostDao(req.dbConnection);
    const totalPosts = await postDao.countPosts();

    res.json({ totalPosts });
}


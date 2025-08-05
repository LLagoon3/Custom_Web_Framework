import { Router } from "../web_server/core/Router";
import { authMiddleware } from "../middleware/authMiddleware";
import { cacheMiddleware } from "../middleware/cacheMiddleware";
import {
    getPostsByPage,
    getPostById,
    getPageByPostId,
    getPrevAndNextPostId,
    createPost,
    getSearchByKeyword,
    getCountPosts,
    deletePost
} from "../controller/postController";


const postRouter = new Router();

postRouter.get('/:id', cacheMiddleware, getPostById);

postRouter.post('/', authMiddleware('user'), createPost);

postRouter.patch('/:id', authMiddleware('user'), createPost);

postRouter.delete('/:id', authMiddleware('user'), deletePost);

postRouter.get('/page/:page', cacheMiddleware, getPostsByPage);

postRouter.get('/page_number/:postId', cacheMiddleware, getPageByPostId);

postRouter.get('/prev_and_next/:postId', cacheMiddleware, getPrevAndNextPostId);

postRouter.get('/count', getCountPosts);

postRouter.get('/search', authMiddleware('user'), getSearchByKeyword);


// postRouter.post('/register', register);

export default postRouter;
import { Application } from './web_server/core/Application';
import { Router } from './web_server/core/Router';

import { staticMiddleware } from './web_server/middlewares/staticMiddleware';
import { staticRedisCacheMiddleware, staticMemoryCacheMiddleware } from './web_server/middlewares/staticCacheMiddleware';
import { sessionMiddleware } from './web_server/middlewares/sessionMiddleware';
import { transactionMiddleware } from './middleware/transactionMiddleware';
import { cacheMiddleware } from './middleware/cacheMiddleware';
import { bodyParseMiddleware } from './web_server/middlewares/bodyParseMiddleware';
import { uploadMiddleware } from './web_server/middlewares/uploadMiddleware';
import { ErrorHandleMiddleware } from './middleware/errorHandleMiddleware';

import * as path from 'path';

import staticRouter from './route/staticRouter';
import userRouter from './route/userRouter';
import postRouter from './route/postRouter';
import commentRouter from './route/commentRouter';
import imageRouter from './route/imageRouter';

export const staticPath = path.join(__dirname, '../', 'static');

const app = new Application();

app.use((req, res, next) => { 
    console.log(`\nrequest received - ${req.method} ${req.path}`);
//   res.on('finish', () => console.log(`response sent - ${res.statusCode}`));
  next();
});

// 미들웨어 등록
app.use('/was', staticMemoryCacheMiddleware(staticPath));
// app.use('/was', staticMiddleware(staticPath));
// app.use(cacheMiddleware);
app.use(transactionMiddleware);
app.use(sessionMiddleware({
    cookie: {
        MaxAge: 60 * 10,
        // HttpOnly: false,
        Path: '/',
        SameSite: 'None',
        Secure: true,
    }
}));

// request의 body를 파싱하는 미들웨어는 나중에 등록
app.use(bodyParseMiddleware);
app.use('/image', uploadMiddleware(path.join(staticPath, 'image')));


// 라우터 등록
app.use('/was', staticRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/image', imageRouter);

app.use(ErrorHandleMiddleware);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

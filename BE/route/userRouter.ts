import { Router } from "../web_server/core/Router";
import { staticPath } from "../app";
import * as path from 'path';

import { login, logout, register, oauthLogin, oauthCallback } from '../controller/userController';


const userRouter = new Router()

userRouter.post('/login', login);

userRouter.get('/logout', logout);

userRouter.post('/register', register);

userRouter.get('/oauth', oauthLogin);

userRouter.get('/oauth/callback', oauthCallback);

export default userRouter;
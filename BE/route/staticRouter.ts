import { Router } from "../web_server/core/Router";
import { staticPath } from "../app";
import { authMiddleware } from "../middleware/authMiddleware";
import * as path from 'path';



const staticRouter = new Router()

staticRouter.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'mainPage.html'));
});

staticRouter.get('/login', (req, res) => {
    res.sendFile(path.join(staticPath, 'loginPage.html'));
});

staticRouter.get('/register', (req, res) => {
    res.sendFile(path.join(staticPath, 'registerPage.html'));
});

staticRouter.get('/register-complete', (req, res) => {
    res.sendFile(path.join(staticPath, 'registerCompletePage.html'));
});

staticRouter.get('/post', (req, res) => {
    res.sendFile(path.join(staticPath, 'postDetailPage.html'));
});

staticRouter.get('/write', authMiddleware('user'), (req, res) => {
    res.sendFile(path.join(staticPath, 'postingPage.html'));
});

export default staticRouter;
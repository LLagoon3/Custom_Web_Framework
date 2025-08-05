import { Request } from "../web_server/core/Request";
import { Response } from "../web_server/core/Response";
import { RouteHandler } from "../web_server/interfaces/routerHandler";
import { UserDao } from "../dao/UserDao";
import { User } from "../model/User";

import * as bcrypt from 'bcrypt'
import axios from 'axios';
import * as querystring from 'querystring';

const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const isUserRegistered = async (userDao: UserDao, user: User) => {
    const foundUser = await userDao.findByEmail(user.email);
    if (foundUser && await bcrypt.compare(user.password, foundUser.password)) {
        return foundUser;
    }
    return false;
}

export const login: RouteHandler = async (req: Request, res: Response) => {
    const userDao = new UserDao(req.dbConnection);
    const user = await userDao.findByEmail(req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = {
            id: user.id,
            role: 'user',
            email: user.email,
            nickname: user.nickname
        }
        res.cookie('email', user.email);
        res.cookie('nickname', user.nickname);
        res.redirect(302, '/was/');
    }
    else {
        res.redirect(302, '/was/login');
    }
}

export const logout: RouteHandler = (req: Request, res: Response) => {
    req.session.destroy();
    res.clearCookie('nickname');
    res.redirect(302, '/was/');
}

export const register: RouteHandler = async (req: Request, res: Response) => {
    // 중복 닉네임 검증과정 필요
    let { nickname, email, password } = req.body;
    password = await hashPassword(password);
    const newUser = new User({ nickname, email, password });

    const userDao = new UserDao(req.dbConnection);
    userDao.create(newUser);

    res.cookie('email', email);
    res.cookie('nickname', nickname);
    res.redirect(302, '/was/register-complete');
}

const getAccessTokenFromCode = async (authorizationCode: string) => {
    const tokenResponse = await axios.post(process.env.TOKEN_URL, querystring.stringify({
            code: authorizationCode,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    
    return { accessToken, refreshToken };
}

export const oauthLogin: RouteHandler = async (req: Request, res: Response) => {
    const authorizationUrl = `${process.env.AUTHORIZATION_URL}?${querystring.stringify({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        access_type: 'offline'
    })}`;
    res.redirect(302, authorizationUrl);
}

const getUserInfoFromToken = async (accessToken: string) => {
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`
            }
    });
    
    const userInfo = userInfoResponse.data;
    return userInfo;
}

export const oauthCallback: RouteHandler = async (req: Request, res: Response) => {
    try {
        const userDao = new UserDao(req.dbConnection);
        const authorizationCode = req.query.code;

        if (!authorizationCode) return res.status(400).send('Authorization code not provided');

        const { accessToken, refreshToken } = await getAccessTokenFromCode(authorizationCode);

        const userInfo = await getUserInfoFromToken(accessToken);

        const user = new User({
            email: userInfo.email,
            nickname: userInfo.name,
            password: userInfo.sub
        });
        
        const isRegistered = await isUserRegistered(userDao, user);
        let userId;
        
        if (isRegistered) userId = isRegistered.id;
        else {
            user.password = await hashPassword(user.password);
            userId = await userDao.create(user);
        }

        req.session.user = {
            id: userId,
            role: 'user',
            email: user.email,
            nickname: user.nickname
        }
        res.cookie('email', user.email);
        res.cookie('nickname', user.nickname);
        res.redirect(302, '/was/');

        // res.render('index', { user: userInfo, accessToken, refreshToken });

    } catch (err) {
        console.error('OAuth callback failed:', err);
        res.redirect(302, '/was/login');
    }
}
import { Request } from "../core/Request";
import { Response } from "../core/Response";
import { MiddlewareFunction } from '../interfaces/middlewareFunction';
import { clearAllCookies } from '../util/util';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from "../../config/redis";

// 세션 스토어를 여기에 정의하는 것이 맞을까?
const sessionStore: { [key: string]: { data: any, expiresAt: number } } = {};

type SessionConfig = {
    memoryStore?: Object, // 세션 저장소
    secret?: string, // 비밀 키
    resave?: boolean, // 요청이 왔을 때 세션에 수정사항이 없어도 세션을 다시 저장할지 여부
    saveUninitialized?: boolean, // 세션에 저장할 내역이 없더라도 세션을 저장할지 여부
    cookie?: {
        HttpOnly?: boolean, // 클라이언트 측에서 쿠키에 접근 불가 (보안)
        MaxAge?: number, // 쿠키 만료 시간 (1시간)
        Path?: string // 쿠키 경로
        SameSite?: string // 쿠키의 SameSite 설정
        Secure?: boolean // HTTPS에서만 쿠키 전송
    }
}

export const sessionMiddleware = (sessionConfig: SessionConfig = {}): MiddlewareFunction => {
    return (req: Request, res: Response, next: Function) => {
        const SESSION_COOKIE_NAME = 'session_id';
        const SESSION_LIFETIME = sessionConfig.cookie?.MaxAge ?? 1000 * 60 * 10;

        let sessionId = req.cookies[SESSION_COOKIE_NAME];

        const cookieConfig = {
            'max-age': SESSION_LIFETIME,
            Path: sessionConfig.cookie?.Path ?? '/',
            SameSite: sessionConfig.cookie?.SameSite ?? 'None',
        }
        sessionConfig.cookie?.HttpOnly ? cookieConfig['HttpOnly'] = 'true' : null;
        sessionConfig.cookie?.Secure ? cookieConfig['Secure'] = 'true' : null;
        res.cookieConfig = cookieConfig;

        // 세션 아이디가 없는 경우
        if (!sessionId || !sessionStore[sessionId]) {
            clearAllCookies(req, res);
            sessionId = uuidv4();
            res.cookie(SESSION_COOKIE_NAME, sessionId);

            sessionStore[sessionId] = {
                data: {},
                expiresAt: Date.now() + SESSION_LIFETIME * 1000
            };
        }

        // 세션 아이디가 만료된 경우
        else {
            const session = sessionStore[sessionId];
            if (session.expiresAt < Date.now()) {
                sessionStore[sessionId] = {
                    data: {},
                    expiresAt: Date.now() + SESSION_LIFETIME * 1000
                };
            }
        }

        // 세션 삭제 함수
        const sessionDestroy = (callback: Function | null) => {
            try {
                callback ? callback(null) : null;
                delete sessionStore[sessionId];
            }
            catch (err) {
                callback ? callback(err) : null;
                throw err;
            }
            
        }
        req['session'] = sessionStore[sessionId].data;
        req.session.destroy = sessionDestroy;

        next();

        if (sessionId in sessionStore) {
            sessionStore[sessionId].expiresAt = Date.now() + SESSION_LIFETIME * 1000;
        }


    }
}


// type SessionConfig = {
//     memoryStore?: Object, // Session store (not used anymore)
//     secret?: string, // Secret key
//     resave?: boolean, // Whether to resave the session even if it hasn't changed
//     saveUninitialized?: boolean, // Whether to save uninitialized sessions
//     cookie?: {
//         HttpOnly?: boolean, // Prevent client-side access to cookies (security)
//         MaxAge?: number, // Cookie expiration time (e.g., 1 hour)
//         Path?: string // Cookie path
//         SameSite?: string // SameSite setting for the cookie
//         Secure?: boolean // Only send cookie over HTTPS
//     }
// }

// export const sessionMiddleware = (sessionConfig: SessionConfig = {}): MiddlewareFunction => {
//     return async (req: Request, res: Response, next: Function) => {
//         const SESSION_COOKIE_NAME = 'session_id';
//         const SESSION_LIFETIME = sessionConfig.cookie?.MaxAge ?? 1000 * 60 * 10;

//         let sessionId = req.cookies[SESSION_COOKIE_NAME];

//         const cookieConfig = {
//             'max-age': SESSION_LIFETIME,
//             Path: sessionConfig.cookie?.Path ?? '/',
//             SameSite: sessionConfig.cookie?.SameSite ?? 'None',
//         }
//         sessionConfig.cookie?.HttpOnly ? cookieConfig['HttpOnly'] = 'true' : null;
//         sessionConfig.cookie?.Secure ? cookieConfig['Secure'] = 'true' : null;
//         res.cookieConfig = cookieConfig;

//         if (!sessionId) {
//             // No session ID present, generate a new one
//             sessionId = uuidv4();
//             res.cookie(SESSION_COOKIE_NAME, sessionId);

//             await redisClient.hset(sessionId, {
//                 data: JSON.stringify({}),
//                 expiresAt: (Date.now() + SESSION_LIFETIME * 1000).toString()
//             });
//         }
//         else {
//             // Session exists, check expiration
//             const sessionData = await redisClient.hgetall(sessionId);
//             console.log(sessionData);
//             if (!sessionData || Date.now() > Number(sessionData.expiresAt)) {
//                 // Session expired or not found
//                 await redisClient.hset(sessionId, {
//                     data: JSON.stringify({}),
//                     expiresAt: (Date.now() + SESSION_LIFETIME * 1000).toString()
//                 });
//             }
//         }

//         // Attach session data to request
//         const sessionData = await redisClient.hget(sessionId, 'data');
//         req['session'] = sessionData ? JSON.parse(sessionData) : {};

//         // Session destroy function
//         req.session.destroy = async (callback: Function | null) => {
//             try {
//                 await redisClient.del(sessionId);
//                 if (callback) callback(null);
//             } catch (err) {
//                 if (callback) callback(err);
//                 throw err;
//             }
//         };

//         next();

//         // Update session expiration after request handling
//         if (await redisClient.exists(sessionId)) {
//             await redisClient.hset(sessionId, 'expiresAt', (Date.now() + SESSION_LIFETIME * 1000).toString());
//         }
//     }
// }
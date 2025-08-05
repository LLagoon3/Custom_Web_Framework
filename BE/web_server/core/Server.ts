import { createServer, Socket } from 'net';
import { Request } from './Request';
import { Response } from './Response';
import { Application } from './Application';
import cluster from 'cluster';
import { cpus } from 'os';
import { once } from 'events';

// export class Server {
//     private app: Application;
    
//     constructor(app: Application) {
//         this.app = app;
//     }
    
//     listen(port: number, callback?: () => void) {
//         if (cluster.isPrimary) {
//             const numCPUs = cpus().length;
//             console.log(`Primary ${process.pid} is running`);
            
//             for (let i = 0; i < numCPUs; i++) {
//                 cluster.fork();
//             }

//             cluster.on('exit', (worker, code, signal) => {
//                 console.log(`Worker ${worker.process.pid} died`);
//                 cluster.fork();
//             });
//         } else {
//             const server = createServer(async (socket: Socket) => {
//                 try {
//                     // 소켓에서 데이터 수신 (청크 단위)
//                     const request = new Request();
//                     const response = new Response(socket);

//                     socket.on('error', (err) => {
//                         console.error('Socket error:', err);
//                     });

//                     while (true) {
//                         const [data] = await once(socket, 'data');
//                         // 데이터를 Request 객체에 저장
//                         request.receiveChunk(data);

//                         // 헤더가 완성되지 않았다면 다음 청크를 받아옴
//                         if (request.headersParsed && !request.isMiddlewareHandled) {
//                             await this.app.handle(request, response);
//                             request.isMiddlewareHandled = true;
//                             break;
//                         }
//                     }
//                 } catch (err) {
//                     console.error('Error handling socket:', err);
//                 }
//             });

//             server.listen(port, callback);
//             console.log(`Worker ${process.pid} started`);
//         }
//     }
// }

export class Server {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }
    listen(port: number, callback?: () => void) {
        const server = createServer((socket: Socket) => {
            // 소켓에서 데이터 수신 (청크 단위)
            const request = new Request();
            socket.on('data', (data: Buffer) => {
                // 데이터를 Request 객체에 저장
                request.receiveChunk(data);
                // 헤더가 완성되지 않았다면 다음 청크를 받아옴
                if (request.headersParsed && !request.isMiddlewareHandled) {
                    const response = new Response(socket);
                    this.app.handle(request, response);
                    request.isMiddlewareHandled = true;
                }
            });

            // 소켓 종료 시 (모든 데이터 수신 완료)
            socket.on('end', () => {
                // console.log('Socket ended');
            });
            socket.on('error', (err) => {
                console.error('Socket error:', err);
            });
        });

        server.listen(port, callback);
    }
}
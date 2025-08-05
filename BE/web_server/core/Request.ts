import { EventEmitter } from 'events';

export class Request extends EventEmitter {
    headers: { [key: string]: string } = {};
    body: { [key: string]: string } = null;
    method: string;
    path: string;
    query: { [key: string]: string } = {};
    version: string;
    params: { [key: string]: string } = {};
    cookies: { [key: string]: string } = {};
    session: { [key: string]: any } = {};
    dbConnection: any;
    files: any[] = [];

    headersParsed: boolean = false;
    flowing: boolean = false; // flow 모드 여부
    isMiddlewareHandled: boolean = false; // 미들웨어 체인 실행 여부
    private buffer: Buffer[] = []; // 데이터 청크를 저장할 버퍼
    private contentLength: number = 0; // Content-Length

    constructor() {
        super();
    }

    // 데이터 청크를 버퍼에 저장
    receiveChunk(chunk: Buffer) {
        if (this.flowing) {
            // 이미 flow 모드라면 바로 이벤트로 방출
            this.emit('data', chunk);
            this.contentLength += chunk.length;
            if(this.contentLength === parseInt(this.headers['Content-Length'])) {
                this.end();
            }
        }
        else if (this.buffer.length === 0 && !this.headers['Content-Length']) {
            // 헤더가 완성되지 않았다면 헤더 처리
            const separatorIndex = chunk.indexOf("\r\n\r\n");
            if (separatorIndex !== -1) {
                const headerBuffer = chunk.slice(0, separatorIndex);
                const bodyBuffer = chunk.slice(separatorIndex + 4); // '\r\n\r\n' 이후 본문

                const headerStr = headerBuffer.toString(); // 헤더는 문자열로 처리
                const [startLine, ...requestHeader] = headerStr.split("\r\n");

                this.parseStartLine(startLine);
                this.parseHeader(requestHeader);
                this.parseCookies();
                
                if (bodyBuffer) {
                    this.buffer.push(bodyBuffer);
                    this.contentLength += bodyBuffer.length;
                }
            }
            this.headersParsed = true;
        }
        else {
            // flow 모드가 아니라면 버퍼에 저장
            this.buffer.push(chunk);
            this.contentLength += chunk.length;
        }
    }

    // 모든 데이터가 수신 완료된 경우 호출
    end() {
        // 버퍼에 남아있는 데이터 방출
        this.buffer.forEach((chunk) => this.emit('data', chunk));
        this.buffer = [];

        // 'end' 이벤트 방출
        this.emit('end');
    }

    // 'data' 이벤트 핸들러 등록 시 flow 모드로 전환
    on(event: 'data' | 'end', listener: (...args: any[]) => void): this {
        super.on(event, listener);

        if (event === 'data') {
            this.setFlowing(true);
        }

        return this;
    }

    // flow 모드 설정
    public setFlowing(flow: boolean) {
        if (this.flowing === flow) return;
        this.flowing = flow;

        if (flow) {
            this.buffer.forEach((chunk) => this.emit('data', chunk));
            this.buffer = [];
            if(this.contentLength === parseInt(this.headers['Content-Length'] as string)) {
                this.end();
            }
        }
    }
    
    private parseStartLine(startLine: string) {
        [this.method, this.path, this.version] = startLine.split(' ');
        this.parsePathAndQuery(this.path);
    }

    private parseHeader(headerMsg: string[]) {
        headerMsg.forEach((line) => {
            const [key, value] = line.split(":");
            if (key && value) {
                this.headers[key.trim()] = value.trim();
            }
        });
    }

    private parsePathAndQuery(path: string) {
        const [rawPath, queryString] = path.split('?');
        const query: { [key: string]: string } = {};

        if (queryString) {
            queryString.split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key) {
                    query[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
                }
            });
        }

        this.path = rawPath;
        this.query = query;
    }

    private parseCookies() {
        const cookieHeader = this.headers['Cookie'];
        if (cookieHeader) {
            cookieHeader.split(';').forEach(cookie => {
                const [key, value] = cookie.split('=');
                this.cookies[key.trim()] = value.trim();
            });
        }
    }

    accepts(type: string) {
        // const acceptHeader = this.headers['Accept'];
        if(this.headers['Accept'].includes(type)) return true;
        else return false;
    }

}

import { Socket } from 'net';
import { EventEmitter, Writable } from 'stream';
import { statusMsg } from '../util/const';
import { mimeTypes } from '../util/const';

import * as fs from 'fs';
import * as path from 'path';

const mixin = <T extends new (...args: any[]) => any>(Base: T) => {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      Writable.call(this); // Writable 생성자 호출
    }
  }
}

export class Response extends mixin(EventEmitter) {
    private socket: Socket;
    private headers: Record<string, string> = {}; 
    private cookies: string[] = [];
    public cookieConfig: { [key: string]: any } = {};
    public statusCode: number = 200;
    public finished: boolean = false;
    private hasSentHeaders: boolean = false; // 헤더 전송 여부

  constructor(socket: Socket) {
    super();
    this.socket = socket;
  }

  setHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  private sendHeaders() {
    if (this.hasSentHeaders) return; 

    this.hasSentHeaders = true;

    this.socket.write(`HTTP/1.1 ${this.statusCode} ${statusMsg[this.statusCode]}\r\n`);

    for (const key in this.headers) {
      this.socket.write(`${key}: ${this.headers[key]}\r\n`);
    }

    this.cookies.forEach(cookie => {
      this.socket.write(`Set-Cookie: ${cookie}\r\n`);
    });

    this.socket.write('\r\n'); 
  }

  writeHead(statusCode: number, headers: Record<string, string>) {
    this.statusCode = statusCode;
    Object.assign(this.headers, headers);
  }

  // write(chunk: string | Buffer) {
  //   try {
  //       if (this.socket.writable) {
  //           this.socket.write(chunk);
  //       } else {
  //           console.warn('Socket is no longer writable.');
  //       }
  //   } catch (error) {
  //       console.error('Error writing to socket:', error);
  //   }
    // }


    _write(chunk: Buffer, encoding: string, callback: () => void) {
        try {
            if (this.socket.writable) {
                this.socket.write(chunk);
            } else {
                console.warn('Socket is no longer writable.');
            }
        } catch (error) {
            console.error('Error writing to socket:', error);
        }
        callback(); // 스트림 처리가 끝났음을 알림
    }

  send(body: Buffer | string, contentType = 'text/plain') {
    this.setHeader('Content-Type', contentType);
    this.setHeader('Content-Length', Buffer.byteLength(body).toString());
    this.sendHeaders();
    this.socket.write(body);
    this.end();
  }

  end() {
    if (!this.hasSentHeaders) {
      this.sendHeaders();
    }
    this.socket.end();
    this.finished = true;
    this.emit('finish');
  }

  cookie(name: string, value: string, options: { [key: string]: any } = this.cookieConfig) {
    let cookie = `${name}=${value}`;
    for (const key in options) {
      cookie += `; ${key}=${options[key]}`;
    }
    this.cookies.push(cookie); 
  }

  clearCookie(name: string, options: { [key: string]: any } = {'Path': '/'}) {
    let cookie = `${name}=; Max-Age=0`;
    for (const key in options) {
      cookie += `; ${key}=${options[key]}`;
    }
    this.cookies.push(cookie);
  }

  status(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  }

  redirect(statusCode: number, url: string) {
    this.status(statusCode).setHeader('Location', url);
    this.end();
  }

  sendFile(filePath: string) {
    fs.stat(filePath, (err, stats) => {
      if(err || !stats.isFile()) {
        this.status(404).send('Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, data) => {
        if (err) {
          this.status(500).send('Internal Server Error');
          return;
        }

        this.send(data, contentType);
      });
    });
  }

  json(data: any) {
    this.send(JSON.stringify(data), 'application/json');
  }
}

Object.setPrototypeOf(Response.prototype, Writable.prototype);

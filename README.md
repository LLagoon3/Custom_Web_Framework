# WEB-BE-P2-WAS

<details>
<summary>ReadMe</summary>
<div markdown="1">

## Architecture

![https://images2.imgbox.com/81/69/6EtgQbFy_o.png](https://images2.imgbox.com/81/69/6EtgQbFy_o.png)

## 디렉토리 구조

### BE

```
BE
├── controller
├── dao
├── database
├── middleware
├── model
├── route
└── web_server
```

- `web_server` 는 `express.js` 를 흉내낸 웹 프레임 워크 입니다.
- 어플리케이션은 MVC 패턴을 기반으로 구현하였습니다.
- `app.ts` 가 시작점입니다.

### web_server

```
web_server
├── core
│   ├── Application.ts # 프레임워크 시작점을 제공합니다.
│   ├── Middleware.ts # 미들웨어 처리를 담당합니다.
│   ├── Request.ts
│   ├── Response.ts
│   ├── Router.ts
│   └── Server.ts # net 모듈을 이용하여 서버를 실행합니다.
├── interfaces
│   ├── middlewareFunction.ts
│   └── routerHandler.ts
├── middlewares # express.js에서 기본 제공하는 미들웨어를 모방하였습니다.
│   ├── jsonMiddleware.ts
│   ├── logger.ts
│   ├── sessionMiddleware.ts
│   └── staticMiddleware.ts
├── routes
├── test
│   └── request.test.ts
└── util
    └── const.ts
```

</div>
</details>

<details>
<summary>web_server 프레임워크 사용법</summary>
<div markdown="1">

## 애플리케이션 초기화

애플리케이션을 초기화 및 라우터, 미들웨어 설정

```tsx
import { Application } from "./web_server/core/Application";
import { Router } from "./web_server/core/Router";

const app = new Application();
const router = new Router();

// 기본 라우트 설정
router.get("/", (req, res) => {
  res.send("Hello, World!");
});

router.get("/about", (req, res) => {
  res.send("About Page");
});

// 라우터 사용
app.use("/api", router);

// 서버 시작
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## 라우팅

`Router` 클래스를 사용하여 동적 및 정적 라우팅을 설정

동적 경로에서 URL 파라미터를 추출하고 사용 가능

```tsx
const router = new Router();

router.get("/:id", (req, res) => {
  const { id } = req.params; // URL 파라미터 사용
  res.send(`Hello, ${id}`);
});
```

## 미들웨어 사용

`app.use()`를 통해 미들웨어를 적용 가능

`책임-연쇄 패턴` 사용 및 사용자 정의 순서로 작동

```tsx
app.use((req, res, next) => {
  console.log(`[Request]: ${req.method} ${req.path}`);
  next(); // 다음 미들웨어로 이동
});
```

### 정적 파일 서빙

`staticMiddleware` 사용

```tsx
import { staticMiddleware } from "./web_server/middlewares/staticMiddleware";
import * as path from "path";

const staticPath = path.join(__dirname, "../", "static");
app.use("/", staticMiddleware(staticPath));
```

### 세션 관리

`sessionMiddleware` 사용

```tsx
import { sessionMiddleware } from "./web_server/middlewares/sessionMiddleware";

// 세션 미들웨어 적용
app.use(
  sessionMiddleware({
    // 쿠키 설정
    cookie: {
      MaxAge: 1000 * 60 * 10,
      HttpOnly: true,
      Path: "/",
    },
  })
);

// 세션 설정
app.get("/session/set", (req, res) => {
  req.session.user = { name: "test user" };
  res.send("Session set");
});

// 세션 가져오기
app.get("/session/get", (req, res) => {
  if (!req.session.user) {
    return res.send("No session found");
  }
  res.send(`Hello, ${req.session.user.name}`);
});
```

## 서버 시작

`app.listen()` 메서드를 사용
포트번호 및 콜백 지정가능

```tsx
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

</div>
</details>

<details>
<summary>주간 계획서 1주차</summary>
<div markdown="1">

# 🔥 우리의 주간 계획서 (1주차)

## 계획

### 설계 [architecture.md](http://architecture.md/) 작성

### 로거 (honux: winston 추천)

- 로거 라이브러리 선택과 기술적 근거 찾기

### 웹 페이지 구현

- CSS 컬러 및 사이즈 템플릿 선언
- 리액트 학습
- 컴포넌트 구현
  - 로그인/회원가입 네비게이터 버튼 컴포넌트 구현
  - 입력 폼 컴포넌트 구현
  - 로그인 및 회원가입 동작 버튼 구현
- 메인 페이지 구현
- 로그인(Login) 페이지 구현
- 회원가입(Register) 페이지 구현
- 가입 완료 페이지 구현

### NET 모듈 사용해서 HTTP 응답

- HTTP 모듈의 동작 방식 함께 학습하기
- 1단계
  - 로거로 Request message를 확인하고, 출력
  - [http://localhost:3000/index.html](http://localhost:3000/index.html) 접속 시 정적 파일 응답
- 2단계

  - HTTP Request message 구문 분석 후

    - URI에 맞는 응답
    - Content Type 분석 후 응답 지원

      ```
      // 지원할 컨텐츠 타입의 확장자 목록
      html
      css
      js
      ico
      png
      jpg

      ```

- 3단계
  - 요청에 맞게 회원가입 페이지 반환
  - HTTP GET 요청으로 회원가입 정보 전달 (URI로 유저정보 전달)
    ex) /create?userId=javajigi&password=password&name=%EB%B0%95%EC%9E%AC%EC%84%B1&email=javajigi%[40slipp.net](http://40slipp.net/)
  - 유저 생성 및 저장 (DB로)
- 추가 요구 사항
  - 1단계: cluster(멀티 프로세스) 또는 worker thread(멀티 스레드) 활용
  - 3단계: 테스트 라이브러리를 활용해서 단위 테스트를 적용

## 📝 구체적인 학습 및 구현 계획

### 월요일

- 설계 [architecture.md](http://architecture.md/) 작성
- CSS 컬러 및 사이즈 템플릿 선언
- 로거 라이브러리 선택과 기술적 근거 찾기
- HTTP 모듈의 동작 방식 함께 학습하기
- 1단계
  - 로거로 Request message를 확인하고, 출력
  - [http://localhost:3000/index.html](http://localhost:3000/index.html) 접속 시 정적 파일 응답

### 화요일

- 2단계

  - HTTP Request message 구문 분석 후

    - URI에 맞는 응답
    - Content Type 분석 후 응답 지원

      ```
      // 지원할 컨텐츠 타입의 확장자 목록
      html
      css
      js
      ico
      png
      jpg

      ```

### 수요일

- 웹 페이지 구현
  - 리액트 학습
  - 컴포넌트 구현
    - 로그인/회원가입 네비게이터 버튼 컴포넌트 구현
    - 입력 폼 컴포넌트 구현
    - 로그인 및 회원가입 동작 버튼 구현
  - 로그인(Login) 페이지 구현
  - 회원가입(Register) 페이지 구현
  - 가입 완료 페이지 구현

### 목요일

- 3단계
  - 요청에 맞게 회원가입 페이지 반환
  - HTTP GET 요청으로 회원가입 정보 전달 (URI로 유저정보 전달)
    ex) /create?userId=javajigi&password=password&name=%EB%B0%95%EC%9E%AC%EC%84%B1&email=javajigi%[40slipp.net](http://40slipp.net/)
  - 유저 생성 및 저장 (DB로)

### 시간이 남는다면

- 웹 페이지 구현
  - 메인 페이지 구현
- 추가 요구 사항
  - 1단계: cluster(멀티 프로세스) 또는 worker thread(멀티 스레드) 활용
  - 3단계: 테스트 라이브러리를 활용해서 단위 테스트를 적용

## ✏️ 고민과 해결 과정 쌓아가기

<details>
<summary>월요일</summary>
<div markdown="1">

### 설계

### 디렉토리 구조

<img src="[https://i.ibb.co/zskgCj8/image.png](https://i.ibb.co/zskgCj8/image.png)" alt="architecture">

### 흐름

<img src="[https://i.ibb.co/nD2PSg9/Pasted-image-20240923222932.png](https://i.ibb.co/nD2PSg9/Pasted-image-20240923222932.png)"  alt="flow">

### 로거 라이브러리 선택과 기술적 근거 찾기

고민했던 HTTP 로깅 라이브러리들

Morgan - 파일 로깅 기능이 없음, 단순 정상 및 에러 로깅만 지원
Winston - 계층 별 로깅이 가능하고, 다양한 로깅을 지원해서 확장성 면으로 봤을 때 좋아보임
-> Winston이 웹 어플리케이션 전반에 걸친 로그를 남기기에 적합하다고 판단

### 타입스크립트를 이용하기 위해

처음 했던 시도는 .ts 파일을 실행시키기 위해 `ts-node` 패키지를 설치하는 일이었습니다.

```
npm install ts-node

```

이후 ts 파일을 실행했을 때 아래의 에러를 만나게 되었고,

```
TypeError: Unknown file extension ".ts" -> code: 'ERR_UNKNOWN_FILE_EXTENSION'

```

이에 대한 문제를 확인한 결과 `ts-node` 패키지에서 종종 발생하는 문제임을 확인했습니다.

이에 대한 해결책으로 `ts-node` 패키지 대신 `tsx` 패키지를 설치해 사용함으로써 해결할 수 있었습니다.1단계

```
//tsx 패키지 설치
npm install tsx

//실행
npx tsx app.ts

```

### Winston으로 로깅하기

우선 winston을 로깅 용도로 사용하기 위해 패키지를 설치해줬습니다.

```
npm install winston

```

이후 winston을 이용하기 위해 `logger.ts` 파일을 만들어 해당 파일에서 로거를 정의한 이후 사용하도록 작성해봤습니다.

```
//logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export { logger };

```

이후 export한 logger를 app.ts에서 응답 확인용으로 사용했습니다.

```
//app.ts
import { logger } from "./logger";

logger.debug(request);

```

이후 `curl`로 HTTP 요청을 보냈고, 해당 결과를 볼 수 있었습니다.

```
{"level":"debug","message":"GET / HTTP/1.1\\r\\nHost: localhost:3000\\r\\nUser-Agent: curl/8.4.0\\r\\nAccept: */*\\r\\n\\r\\n"}

```

### HTTP 요청에 정적 파일 응답하기

HTTP 요청에 정적 파일을 응답해주기 위해서 index.html을 만들어 줬습니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link
      rel="stylesheet"
      crossorigin
      href="<https://cdn.jsdelivr.net/npm/reset-css@5.0.2/reset.min.css>"
    />
  </head>
  <body>
    <span> HI </span>
  </body>
</html>
```

이후 해당 파일을 읽고, response의 본문으로 응답하기 위해서 fs 모듈로 파일을 읽고, 응답해주는 과정을 수행하려고 했고,

그 과정에서 절대 경로를 지정하기 위해 `fileURLToPath` 모듈과 `path` 모듈을 통해 경로를 생성해줬습니다.

```
//app.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filePath = fileURLToPath(import.meta.url);
const staticFilePath = path.join(filePath, "../../", "static");

            // socket.on(
            const indexHtml = fs.readFileSync(path.join(staticFilePath, "html/index.html"), "utf8");

            socket.write("HTTP/1.1 200 OK\\r\\n");
            socket.write("Content-Type: text/html\\r\\n");
            socket.write("\\r\\n");
            socket.write(indexHtml);
            socket.end();
            ...

```

</div>
</details>

<details>
<summary>화요일</summary>
<div markdown="1">

### HTTP Message 구문 분석하기

이전에 HTTP Message를 로깅하고, HTTP Response Message와 index.html을 응답하는 과정까지 수행했었고,
HTTP Request Message를 전달받았을 때 요청에 대한 내용을 편리하게 이용하고자 HTTP Request 클래스를 정의하게 되었습니다.

```
// ./DTO/Request.ts
class Request {
  headers: { [key: string]: string } = {};
  body: string;
  method: string;
  path: string;
  version: string;
  constructor(msg) {
    this.parseMsg(msg);
  }
}

```

HTTP Reqeust Message를 분리할 때 요청에 들어오는 Header와 Body를 분리하고자 했고, Header에서도 StartLine을 구분해 객체의 필드로 저장할 수 있도록 내부 메서드를 만들어줬습니다.

```
// ./DTO/Request.ts
    private parseMsg(msg) {
        const [headerMsg, bodyMsg] = msg.split("\\r\\n\\r\\n");
        const [startLine, ...requestHeader] = headerMsg.split("\\r\\n");
        this.body = bodyMsg;
        this.parseStartLine(startLine);
        this.parseHeader(requestHeader);
    }

    private parseStartLine(startLine) {
        [this.method, this.path, this.version] = startLine.split(' ');
    }

    private parseHeader(headerMsg) {
        headerMsg.forEach((line) => {
            const [key, value] = line.split(":");
            this.headers[key] = value.trim();
        });
    }

```

### HTTP Response 정의하기

HTTP Request에 대한 정의가 끝나 이용하기 편한 상태로 만들어줬고, 요청에 따라
index.html 뿐만 아니라 다른 확장자의 파일도 응답해주고자 반복되는 패턴에서 응답 내용만 다르게 생성 가능한 HTTP Response에 대한 모델 객체를 정의하기로 했습니다.

```
// ./DTO/Response.ts
export class Response {
  responseMsg: string;
  connection: string;
  constructor(
    statusCode,
    connection,
    ext: string | null = null,
    body: string | null = null
  ) {
    this.connection = connection;
    this.setStatusLine(statusCode);
    this.setHeaders(connection, ext, body);
  }
}

```

Response 클래스에서는 HTTP Response Message String을 구성하기 위해 인자를 전달받고, 이를 통해 `responseMsg`를 구성하는 내부 메서드들로 구성되어 있습니다.

### HTTP Response 객체에서 컨텐츠 타입을 지정하는 방법

1. `setHeader`와 같은 메소드를 사용하여 사용자가 직접 헤더에 Content-Type을 지정하기
2. `sendJson`, `sendFile`와 같은 메소드를 생성하여 문자열 전송과 파일 전송을 분리하기
3. 파라미터로 컨텐츠 확장자를 입력받아 처리하기

`Response` 객체에서 파일 시스템에 접근하는 것은 올바르지 않다고 생각하여 2번은 제외했습니다.
또한 사용자가 직접 헤더를 설정하게 되면 예외처리가 번거로워질 것이라 생각하였고, 따라서 3번으로 결정하였습니다.

```
// ./DTO/Response.ts

//setHeaders() {
if (body) {
  this.responseMsg += `Content-Type: ${contentType[ext]}; charset=UTF-8\\r\\n`;
  this.responseMsg += `Content-Length: ${body.length}\\r\\n`;
}

```

### Response 객체 응답 확인

이후 만들어진 Response 인스턴스의 메시지를 전달했을 때 정상적으로 수신이 되는지 확인해줬습니다.

```
//정상적인 응답
< HTTP/1.1 200 OK
< Server: Web29-A
< Date: Tue, 24 Sep 2024 06:00:58 GMT
< Content-Type: text/html; charset=UTF-8
< Content-Length: 289
< Connection: close

```

```
//잘못된 경로의 응답
< HTTP/1.1 404 Not Found
< Server: Web29-A
< Date: Tue, 24 Sep 2024 06:01:58 GMT
< Connection: close

```

### Router와 Response 객체

express의 router와 유사하게 `Router.requestHandler`에서 파라미터로 `res` 객체를 넘겨 `res.end`와 같은 처리를 하려고 계획했습니다.

1. `response` 객체에서 `socket`을 넘겨 처리하는 방식으로 재구성
2. `req` 객체만 넘기고 Controller에서 `res` 객체 생성 후 반환

현재 `response` 객체의 구현을 변경하지 않도록 2번을 선택했습니다.

```
// ./route/Router.ts

//requestHandler()
if (exist) return this.route[req.method][routePath](req);

```

### HTTP Path 구분에 관하여

HTTP 요청에 맞게 정적 파일을 응답해주기 위해서 요청의 Path와 method를 구분해 해당 경로에 파일이 존재하는지의 여부와 파일을 응답하는 과정을 수행해야 했습니다.

추후 확장성을 고려해 `route` 라는 디렉토리를 만들어, 경로를 사전에 등록할 수 있게 했고, 등록된 경로를 판단 후 미리 선언된 경로에 등록된 콜백 함수로 Response를 응답할 수 있는 로직을 작성하게 됐는데,

```
class Router {
  //경로 보관
  route = {
    GET: {},
    POST: {},
    PUT: {},
    PATCH: {},
    DELETE: {},
    UPDATE: {},
  };
  //경로 설정
  get(path: string, func: Function) {
    this.route.GET[path] = func;
  }
}

```

해당 방법대로 했을 때의 문제가 하나 존재했습니다.

예를 들어 사전에 등록된 Path가 `/`일 경우에 `/html/index.html`과 같이 요청이 들어오는 경우에도 `/` 경로를 통해 등록된 함수를 실행할 수 있도록 만들고 싶었는데

`object` 타입의 key-value 특성 상 요청이 들어온 Path를 통해 key를 대입했을 때 원하는 방식으로 동작할 수 없었고, `/html/index.html` 처럼 하위 Path로 들어오는 경우에 `/`와 같이 등록된 상위 Path의 함수가 동작할 수 있도록 작성해야 했습니다.

```
고민한 흔적들
//router.get('path', callback);
//router.requestHandler(req);

// "/"
// '/stylesheets/index.css'

// 해당 path로 라우트에 등록이 되어있는지 검사하는 로직
// 경로를 한 개씩 빼는 로직
//while ->등록 여부 검사  o = 탈출 / x = 한 개 빼는 로직 실행 -> 검사 로직 / 한 개 빼는 로직이 실패할 경우 (root) => 404 탈출

/*
staticRoute['/stylesheets/index.css'] << 검사
x -> staticRoute['/stylesheets']; << 검사
x -> staticRoute['/'] < 검사
x -> 404

staticRoute['/stylesheets/'] << method 있을 수 있음
staticRoute['/'] << method 있을 수 있음
*/

```

함께 고민한 끝에 `/html/index.html`처럼 들어오는 경로에 대해 경로를 한 개씩 제외하면서 등록된 함수가 있는지 탐색하는 과정을 거치자는 결론에 이르렀고, 아래와 같이 상위 경로에 등록된 함수의 존재 여부를 확인하고, 없다면 경로를 한 개씩 제외하는 로직을 작성할 수 있었습니다.

```
    requestHandler(req): Response {
        let routePath = req.path;
        while(true) {
            const exist = this.checkRouteExist(req.method, routePath);
            if(routePath === "/" && !exist) throw new Error("No Route");
            if(exist) return this.route[req.method][routePath](req);
            else routePath = this.reducePath(routePath);
        }
    }

//해당 경로로 등록된 method가 존재하는지 판단하는 함수
    private checkRouteExist(method, path) {
        const callback: Function | null = this.route[method][path];
        return callback != null;
    }

//경로를 한 개씩 제외하는 함수
    private reducePath(path) {
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        const lastSlashIndex = path.lastIndexOf('/');

        if(lastSlashIndex === - 1){
            return '/';
        }
        return path.substring(0, lastSlashIndex + 1);
    }

```

### staticController 구현

정적 파일을 서빙하는 컨트롤러를 구현했습니다.
`req.path`를 이용하여 서빙할 정적 파일의 경로를 확인하고,
파일이 존재할 경우 Response 객체에 담아 리턴하는 방식을 사용하였습니다.
기본경로 `/`는 `index.html`을 반환하도록 하였습니다.

```
const filePath = path.join(
  staticFilePath,
  req.path === "/" ? "html/index.html" : req.path
);
const ext = path.extname(filePath);
if (fs.existsSync(filePath)) {
  const file = fs.readFileSync(filePath, "utf-8");
  const response = new Response(
    200,
    req.headers.Connection ?? "close",
    ext,
    file
  );
  return response;
}
const response = new Response(404, req.headers.Connection ?? "close");
return response;

```

### 정적 파일 응답 결과

<img src="[https://i.postimg.cc/4N47dzhS/2024-09-24-6-39-23.png](https://i.postimg.cc/4N47dzhS/2024-09-24-6-39-23.png)" alt="2024-09-24-6-34-42"
width=350px>

</div>
</details>

<details>
<summary>수요일</summary>
<div markdown="1">

### 브라우저 화면 구현하기

프론트엔드 코드를 작성하기 이전에 저희는 고민을 했습니다.

이전에 템플릿 엔진으로 SR을, 바닐라 자바스크립트, html, CSS를 이용해 CSR을 경험해봤는데
학습을 위해 제약이 있는 서버측 코드와 달리 제약이 없는 프론트엔드 파트에서도 새로운 도전을 해볼 수 있지 않을까? 라는 고민이었습니다.

구현해야 할 웹 페이지 디자인을 봤을 때 재사용하는 컴포넌트가 굉장히 많아 보였고,
어떻게 구현해도 제약이 없다는 점 때문에 평소에 경험해보지 않았던 리액트를 사용해보자는 의견이 나왔습니다.

해당 의견에 모두가 재밌는 경험일 것이라고 생각해 브라우저 화면 렌더링에 리액트를 사용하기로 결정했습니다.

### 리액트 환경 구성

리액트를 이용하기 위해 기존에 구성했던 서버 디렉토리 구조를 `src`에서 `BE`라는 이름으로 리네이밍을 했고,
리액트 환경 구성을 위해 Vite 빌더를 이용해 리액트 환경을 `FE`라는 디렉토리로 생성해 줬습니다.

```

npm create vite@latest

✔ Project name: FE
✔ Select a framework: › React
✔ Select a variant: › TypeScript

cd FE

npm install

npm run dev

```

### 컴포넌트 작성

전체 화면을 구성하기 이전에 디자인을 토대로 재사용되는 컴포넌트들을 먼저 작성하기로 했습니다.

대표적으로 입력 폼, 네비게이터, 버튼이 재사용됨을 확인했고

해당 컴포넌트와 적용될 stylesheets를 작성해줬씁니다.

```tsx
// FE/src/components/Button.tsx
const Button: React.FC<ButtonProps> = ({
  text,
  size,
  onClick,
  disabled = false,
}) => {
  return (
    <button className={`button ${size}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};
```

```tsx
// FE/src/components/InputBox.tsx
const InputBox: React.FC<InputBoxProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = true,
}) => {
  return (
    <div className="input-container">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};
```

로그인과 회원가입을 위한 위 두 가지 컴포넌트를 생성했고,

해당 컴포넌트들이 배치될 프레임을 컴포넌트로 만들었습니다.

```tsx
// FE/src/components/Frame.tsx
const Navigation: React.FC<NavigationProps> = ({ title, children }) => {
  return (
    <div className="navigation">
      <h3>{title}</h3>
      {children}
    </div>
  );
};

const Information: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className="information">
      <h1>{title}</h1>
    </div>
  );
};

const HugFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="hug-frame">{children}</div>;
};
```

실제로 사용되는 모습은 아래처럼 구성중입니다.

```tsx
// FE/src/main.tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </StrictMode>
);

// FE/src/layouts/Login.tsx
const Login: React.FC = () => {
  return (
    <>
      <Navigation title="HELLO, WEB!">
        <Button
          text="로그인/회원가입"
          size="small"
          onClick={navigateToRegister}
        />
      </Navigation>
      <Information title="로그인" />
      <HugFrame>
        <InputBox
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputBox
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </HugFrame>
      <HugFrame>
        <Button text="로그인" size="large" onClick={fetchLogin} />
        <span className="signup-info">
          아직 회원가입을 안하셨나요?
          <a href="<http://localhost:5417/signup>" className="text-link">
            {" "}
            회원가입하기
          </a>
        </span>
      </HugFrame>
    </>
  );
};
```

### 만들어진 결과 (회원가입 페이지)

<img src="[https://i.ibb.co/JqWJtt5/image.png](https://i.ibb.co/JqWJtt5/image.png)" alt="register">

이번 주를 계획할 때는 가입 완료 페이지도 따로 만들 계획을 세웠지만,
로그인 페이지와 기능이 동일하기 때문에 기존 로그인 페이지를 재활용해 리디렉션 후
DOM Object를 수정하는 방향으로 결정했습니다.

</div>
</details>

/\*
제안하고 싶은 부분

1. path가 라우터에 등록될 때 `:` 로 시작하는 경우 뒤의 문자열을 날려서 변수 Path임을 파악할 수 있게 만드는 로직 작성
2. request path에 대해 모든 경우의 수를 만드는 로직 작성

   ex) /user/data -> /user/:, /:/data, /:/:

   (경우의 수 만들 때 변수 : 로 변환되는 Path는 따로 parameters로 저장되어야 함)

3. 경우의 수로 route 탐색하도록 변경 <<< x
4. parameters를 분리해서 반환하는 함수 만들기 (편집됨)
   \*/

나중에 개선한다면?
[https://dear-sawfish-e55.notion.site/1-10dd6568ef4b803f8e23cf39bac56c20](https://www.notion.so/1-10dd6568ef4b803f8e23cf39bac56c20?pvs=21)

Docker를 사용하는 이유

1. VM보다 성능 상 이점,
2. 도커 허브에서 컨테이너 이미지를 이용해 보다 간편한 환경 구성이 가능

```
docker compose up
docker ps //현재 실행중인 컨테이너
docker ps -a //전체 컨테이너
docker start [CONTAINER ID]

```

</div>
</details>

<details>
<summary>주간 계획서 2주차</summary>
<div markdown="1">

## 해야할 것

- **백엔드**
  - MVC 패턴을 사용하여, 로그인 / 회원가입 API 구성하기
  - DB 연결 및 DAO와 repository 기능과 사용여부 명확히 하기
  - 미들웨어를 이용한 트랜잭션 구현하기
- **프론트엔드**
  - React로 구성된 프로젝트 바닐라로 마이그레이션
  - Main_guest 페이지 구성(Optional)
  - Main_member 페이지 구성(Optional)
- **web_server 프레임워크**

  - 각 클래스 별 테스트 코드 작성하기
  - redirect 구현하기
  - `Router`에서 동적, 정적 경로 저장 방식 변경하기(Optional)
  - `req.path`와 미들웨어 `Path` 매칭 방식 개선하기 -> `MiddlewareHandler.matchRoute()`(Optional)

  ## 고민

  ### `sessionStore`의 위치

  현재 세션의 정보를 저장하는 `sessionStore`는 `web_server/middlewares/sessionMiddleware.ts`에 세션 미들웨어와 함꼐 정의되어있다.
  세션에 대한 전체적인 정보를 담고있는 `sessionStore`가 이 위치에 정의되는 것이 올바른지에 대한 의문이 생겼다.

  ### 미들웨어와 라우터의 구분

  현재 `Application.use()` 메소드를 통하여 미들웨어와 라우터를 모두 등록할 수 있다.
  또한 이렇게 등록된 미들웨어와 라우터는 하나의 `Application.middlewares` 객체에 저장된다.
  `staticMiddleware` 사용할 때, 사용자 정의 경로를 `/`로 지정할 경우 `MiddlewareHandler`에서 이를 제대로 처리하지 못하는 문제가 생겨 현재 예외적으로 처리 중이다.
  이를 개선할 수 있는 방법에 대해 고민해봐야겠다.

  ```tsx
  // MiddlewareHandler.matchRoute

  static matchRoute(req: Request, path: string) {
        // '/' 경로의 경우 예외적으로 처리
        if(path === '/' && req.path[0] === '/') return true;
        const [_, primaryPath] = req.path.split('/');
        return '/' + primaryPath === path;
    }

  ```

  ### 프론트엔드에서 사용자의 로그인 여부

  원래는 `mainMemberPage` 와 `mainGuestPage` 를 분리하여 BE에서 사용자 로그인 여부를 확인 후, 적절한 html 파일을 서빙하는 형태였다.
  하지만 이 경우 거의 유사한 두 페이지의 html 파일을 분리해야했기에 코드 중복이 심했다.
  따라서 하나의 `mainPage` 에 SSR을 이용하여 `mainMemberPage` 와 `mainGuestPage` 를 렌더링하도록 수정하였다.
  이때 발생하는 문제점이 FE에서 사용자 로그인 여부를 어떻게 확인하고 SSR을 수행해야 하느냐는 것이었다.
  일단은 쿠키 값을 확인하여 로그인 여부를 확인하고 페이지 렌더링을 하는 형태로 구현하였으나 보안 문제가 있을 것 같다.

  ```tsx
  // static/script/mainPage.js

  // 로그인 여부를 쿠키값으로 판단하는 것이 맞는가?
  const mainPage = () => {
    const nickname = getCookie("nickname");
    if (nickname) {
      mainMemberPage();
    } else {
      mainGuestPage();
    }
  };

  mainPage();
  ```

</div>
</details>

<details>
<summary>주간 계획서 3주차</summary>
<div markdown="1">

## 해야할 것

- BE
  - 토큰인증 방식 구현
  - OAuth 인증 방식 구현
  - post Delete API 구현
  - post ViewCount, comment 테이블 구성 고민해보기
  - user CRUD API 구현
  - 미들웨어에서의 에러처리 관련하여 고민해보기
- FE
  - mainMemberPage, mainGuestPage 분리하기
  - OAuth API 적용하기
  - 사용자 목록 페이지 구현하기
  - 에러 처리 페이지 구현하기

## 해결과정

### 페이징 쿼리

메인 페이지에서 페이지별 글 목록을 보여주어야 하기에, 데이터베이스에서 페이지 단위의 쿼리가 필요했다.

```tsx
const sql = `
            SELECT posts.*, users.nickname 
            FROM ${this.tableName} 
            JOIN users ON posts.author = users.id 
            ORDER BY posts.id DESC 
            LIMIT 10 
            OFFSET ${(page - 1) * 10};
        `;
```

위의 쿼리를 이용하여 `page` 당 10개의 글을 쿼리할 수 있는 API를 작성했다.

이때 주의할 점은 `post` 의 정렬 기준이 `DESC` 이여야지만 최신글 순서대로 보여줄 수 있다.

### 클라이언트에서 상태 저장

이전 taskify와 달리 프론트엔드에서 상태 저장 방식을 사용하고 있지 않다.

따라서 post number와 page number를 저장할 수 있는 방식에 대해 고민했다.

크게 localStorage, sessionStorage, URL QueryString 방식이 존재했다.

여기서 localStorage와 sessionStorage는 단순 URL로 사이트를 로드하게 된다면 적절한 값이 저장되지 않기에 URL QueryString 방식을 사용했다.

```
# postDetail(작성 글을 보여주는 페이지)의 URL 구성
http://localhost:3000/was/post#page=1&post=2055
```

위와 같이 QueryString에 page number와 post number를 저장하게 되고, js에서 이를 참고하여 API를 호출 및 렌더링 한다.

## PostDetail 페이지에서 이전 글, 다음 글 버튼

![https://images2.imgbox.com/cf/84/1qhc2SHj_o.png](https://images2.imgbox.com/cf/84/1qhc2SHj_o.png)

현재 postDetail 페이지에서 `이전` , `다음` 버튼이 존재한다.

페이지 렌더링 시 이 버튼을 어떤 방식으로 렌더링 할 지에 대한 고민이 있었다.

1. 버튼을 누르는 순간 이전 글의 page number, post number를 계산하여 이동한다.
2. 페이지를 렌더링 할 때, 해당 버튼에 대한 URL를 href 속성으로 지정한다.

위의 두 가지 방식에서 첫 번째 방식은 이벤트 리스너 등록 등 구현 과정이 복잡해질 가능성이 있다.

또한 두 번째 방식을 사용할 시, 이동 불가능한 post number에 대해 버튼에 `disabled` 속성을 추가할 수 있다는 장점이 있다.

따라서 두 번째 방식으로 구현을 하였다.

다만 두 번째 방식은 서버 API 호출이 많기 때문에 성능 상 패널티를 가지게 된다.

위의 구현 방식에 대해 다시 한 번 고민해봐야겠다.

## 고민

### posts의 view_count

update가 빈번하게 일어나는 조회수의 경우 인메모리 캐시를 사용하기로 결정하였다.

인메모리 캐시를 직접 구현할 수도 있지만 redis를 제대로 경험해보고 싶었기에 redis를 사용하기로 하였다.

다음은 구현과정에서 몇가지 고민과 해결 과정이다.

1. redis에 저장된 조회수를 어떤 시점에서 DB로 업데이트 할 것인가?

   처음에는 특정 시간이 지난후 redis→DB로 데이터를 업데이트 하는 방식을 고려했다.

   하지만 이 경우 DB에 특정 시간에 IO가 급증하게 된다는 명확한 단점이 있었다.

   따라서 조회수가 특정 횟수 이상 증가하면 DB로 업데이트 시키는 방식을 선택하였다.

2. 조회수 추가를 따로 API로 분리할 것인가?

   조회주 증가 로직은 두 가지 방식으로 처리할 수 있다.

   - 현재 get post API 로직에 조회수 업데이트를 포함시키기
   - 조회수 증가 API를 분리하기

   첫 번째 방식의 경우 API 사용만으로 조회수가 추가된다는 단점이 존재한다.

   다만 두 번째 방식은 백엔드 뿐만 아니라 프론트엔드의 복잡성도 증가함으로 단순한 구현을 위해 첫 번째 방식을 사용하기로 했다.

3. DB에서 조회수는 어디에 저장할 것인가?

   이 경우도 두 가지 방식에 대해 고민했다.

   - view_count 테이블을 따로 생성하기
   - posts 테이블에 view_count 컬럼 추가하기

   두 번째 방식은 redis를 사용하지 않는다는 전제하에 DB의 동시성 문제를 줄이고 성능을 향상시킬 수 있는 방식이었다.

   하지만 redis를 사용한다면 성능 향상과 동시성 문제 모두 해결 가능하며 첫 번째 방식이 더 단순하고 일관성을 가지므로 첫 번째 방식을 선택하였다.

4. Race Condition과 동시성 문제

   ```tsx
   const isViewCount = await redisClient.hGet(
     "post_view_count",
     String(req.params.id)
   );
   if (!isViewCount) {
     await redisClient.hSet(
       "post_view_count",
       String(req.params.id),
       post.view_count || 0
     );
   }
   ```

   위의 부분은 redis의 `post_view_count` 필드의 초기값을 DB의 `post.view_count` 로 설정하는 부분이다.

   이 부분에서 조회수 초기화가 되지 않는 게시물에 대해 여러 사용자가 동시에 접속하게 되면, redis의 `post_view_count` 필드에 대해 race condition의 발생 가능성이 있다고 판단했다.

   따라서 `hGet` 과 `hSet` 을 원자적 처리를 위해 `hSetNX(Set if Not Exists)` 을 사용하도록 하였다.

   ```tsx
   await redisClient.hSetNX(
     "post_view_count",
     String(req.params.id),
     String(post.view_count || 0)
   );
   ```

   위의 과정을 걸쳐 초기화 부분의 Race Condition 문제는 해결되었지만 조회수 업데이트 부분의 동시성 문제는 여전히 남아있다.

   ```tsx
   const viewCount = await redisClient.hIncrBy(
     "post_view_count",
     String(req.params.id),
     1
   );
   if (viewCount - post.view_count > VIEW_COUNT_UPDATE_THRESHOLD)
     await postDao.update(
       new Post({ id: req.params.id, view_count: viewCount })
     );
   ```

   위의 코드는 redis와 DB의 `view_count` 를 비교하여 `VIEW_COUNT_UPDATE_THRESHOLD` 이상 차이나면 redis → DB로 데이터를 업데이트 하는 방식이다.

   이 방식에도 여러 사용자가 동시에 조회수를 업데이트하면 동시성 문제가 발생할 수 있을 것으로 보인다.

</div>
</details>

<details>
<summary>주간 계획서 4주차</summary>
<div markdown="1">

## 해야할 것

- FE
  - 이미지 업로드 기능 추가
  - 에러 페이지 추가
- BE
  - 청크 단위 데이터 수신 구현
  - Redis 사용
  - comment, image API 구현
  - 비동기 에러 전파 및 에러 처리 미들웨어 구현
  - 데이터 베이스 구현(Optional)

## 해결과정

### 청크 단위의 request 처리

내가 파악한 express.js에서 청크단위 request의 body 파싱 방식은 다음과 같다.

1. 가장 먼저 header 데이터를 청크에서 분리한다.
2. header 파싱이 완료되면 미들웨어 체인으로 넘긴다.
3. req.body를 파싱하는 미들웨어는 req에 대해 data, end 이벤트를 등록한다.
   1. data 이벤트는 여러 청크로 나뉘어진 body에 대해, 하나의 청크를 받을 때마다 발생한다.
   2. end 이벤트는 여러 청크로 나뉘어진 body가 모두 수신되면 발생한다.
   3. 따라서 body를 파싱하는 미들웨어를 직접 구현할 때, end 이벤트 핸들러를 data 이벤트 핸들러보다 먼저 등록해야한다.

      왜냐하면 req는 on() 메소드를 이용하여 이벤트를 등록하는 순간부터 flow 모드로 변경되고, data 이벤트를 통해 청크를 전달하기 때문이다.

   4. 추가적으로 body 파싱 미들웨어 간에 body가 이미 파싱되었는지 여부는, req.body의 타입을 보고 결정한다.

위와 같은 방식으로 express.js에서는 request의 header와 body를 분리하여 처리한다.

따라서 body의 크기가 크더라도 header를 먼저 처리해놓고 미들웨어 단에서 body가 수신이 완료될 때까지 기다리게 하는 것이다.

### Redis를 이용한 캐싱

조회수가 아닌 다른 부분에서 Redis를 활용하여 성능 향상을 이루고자하였다.

따라서 API 반환값 캐싱과 static 파일 캐싱을 의해 두 가지 미들웨어를 만들었다.

1. **API 반환값 캐싱**

   1. 구현

   ```tsx
   // BE/middleware/cacheMiddleware.ts
   // cacheMiddleware

   export const cacheMiddleware: MiddlewareFunction = async (
     req,
     res,
     next
   ) => {
     const cacheKey = generateCacheKey(req);
     try {
       const data = await redisClient.get(cacheKey);
       if (data) {
         res.json(JSON.parse(data));
         return;
       } else {
         next();
       }
     } catch (error) {
       throw new HttpError(500, error.message);
     }
   };
   ```

   ```tsx
   // BE/middleware/cacheJsonData.ts
   // cacheJsonData

   export const cacheJsonData = (req: Request, data: any) => {
     const cacheKey = generateCacheKey(req);
     redisClient.setEx(cacheKey, 60, JSON.stringify(data));
   };
   ```

   위와 같이 API의 반환 값을 json으로 캐싱하고 이를 불러오는 미들웨어를 구현하였다.

   b. 결과

   하지만 캐싱 미들웨어를 적용해도 성능 차이가 나지 않았다.

   - 캐싱 기능 적용 전
     ![https://images2.imgbox.com/fe/8d/fb4rAIaZ_o.png](https://images2.imgbox.com/fe/8d/fb4rAIaZ_o.png)
   - 캐싱 기능 적용 후
     ![https://images2.imgbox.com/6d/0b/HAtXroRJ_o.png](https://images2.imgbox.com/6d/0b/HAtXroRJ_o.png)

   실제로 캐싱 기능 적용 이후 response time이 길어진 것을 볼 수 있다.

   c. 개선

   이후 Redis의 키 값을 생성하는 `generateCacheKey` 를 수정하였다.

   ```tsx
   // BE/utill/generateCacheKey.ts
   // generateCacheKey

   export const generateCacheKey = (req: Request): string => {
     return `${req.method}:${req.path}${
       req.params ? `:${JSON.stringify(req.params)}` : ""
     }${req.query ? `:${JSON.stringify(req.query)}` : ""}`;
   };
   ```

   `JSON.stringify` 가 많은 자원을 소모한다는 가정을 세우고 이를 개선해보았다.

   캐시 키 생성 시, `generateCacheKey` 에서 `JSON.stringify` 사용을 제외하였고, `cacheMiddleware` 에서 `res.send` 를 이용하여 `JSON.parse` 사용을 제거하였다.

   d. 개선 결과

   ![https://images2.imgbox.com/db/c1/IEv5TQWU_o.png](https://images2.imgbox.com/db/c1/IEv5TQWU_o.png)

   결과적으로 응답시간이 **15ms → 6ms로 개선**되었다.

2. **static 파일 캐싱**

   1. 구현

      json 캐싱과 동일하게 `staticCacheMiddleware` 를 구성하였다.

      ```tsx
      // BE/web_server/middleware/staticCacheMiddleware.ts
      // staticCacheMiddleware

      export const staticCacheMiddleware = (
        staticPath: string
      ): MiddlewareFunction => {
        return async (req: Request, res: Response, next: Function) => {
          if (req.path === "/") {
            req.path = "/mainPage.html";
          }
          const filePath = path.join(staticPath, req.path);

          try {
            // 캐시 여부 확인
            const cachedData = await redisClient.get(filePath);
            if (cachedData) {
              console.log("Cache hit");
              const ext = path.extname(filePath).toLowerCase();
              const contentType = mimeTypes[ext] || "application/octet-stream";
              res.send(Buffer.from(cachedData, "base64"), contentType);
              return;
            }

            // 파일 읽기 및 캐싱
            const stats = await fs.promises.stat(filePath);
            if (!stats.isFile()) {
              console.log(`File not found: ${filePath}`);
              next();
            }

            const data = await fs.promises.readFile(filePath);
            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || "application/octet-stream";

            // 데이터 캐싱 (TTL 60초 설정)
            await redisClient.set(filePath, data.toString("base64"));

            res.send(data, contentType);
          } catch (error) {
            if (error.code === "ENOENT") {
              // 파일이 없는 경우
              return next();
            }
            console.error(`Error in static cache middleware: ${error.message}`);
            next();
          }
        };
      };
      ```

   b. 결과

   - static 캐싱 기능 적용 전
     ![https://images2.imgbox.com/a3/da/XopZzpwO_o.png](https://images2.imgbox.com/a3/da/XopZzpwO_o.png)
   - static 캐싱 기능 적용 후
     ![https://images2.imgbox.com/d5/72/M71BOlNQ_o.png](https://images2.imgbox.com/d5/72/M71BOlNQ_o.png)

   캐싱 기능 적용 이후 Download Time은 줄어들었지만, Transfer Start Time이 증가하였다.

   이에 대한 이유를 찾아본 결과 특정 파일에 대해 운영체제에서 메모리 캐싱이 일어나는 것으로 판단된다.

   따라서 redis에 캐시하는 경우 메모리에 캐싱하는 방식보다 추가적인 네트워크 IO 발생과 Buffer를 String으로 변환하는 과정으로 인해 응답 속도가 더 느려지는 것으로 보인다.

   c. 개선

   redis 대신 사용할 인메모리 캐시인 `MemoryCache` 를 구현하였다.

   ```tsx
   // BE/web_server/util/MemoryCache.ts
   // MemoryCache

   class MemoryCache {
     private cache: Map<string, CacheEntry> = new Map();

     set(key: string, value: Buffer, contentType: string, ttl: number = 60000) {
       const expiresAt = Date.now() + ttl;
       this.cache.set(key, { value, contentType, expiresAt });
     }

     get(key: string): CacheEntry | undefined {
       const entry = this.cache.get(key);
       if (entry && entry.expiresAt > Date.now()) {
         return entry;
       }
       this.cache.delete(key);
       return undefined;
     }

     // 만료된 항목을 주기적으로 제거
     cleanUp() {
       const now = Date.now();
       for (const [key, entry] of this.cache) {
         if (entry.expiresAt <= now) {
           this.cache.delete(key);
         }
       }
     }
   }
   ```

   `staticMemoryCacheMiddleware` 또한 `MemoryCache` 를 사용하도록 개선하였다.

   다만 clustering 사용 시, 메모리 공유가 불가능하기에 clustering 사용을 중단하였다.

   d. 개선 결과

   ![https://images2.imgbox.com/42/f8/tBBomO91_o.png](https://images2.imgbox.com/42/f8/tBBomO91_o.png)

   Response Time이 **64ms → 30ms로 개선**되었다.

</div>
</details>

<details>
<summary>Review Week1-2</summary>
<div markdown="1">

## Review

### 클라이언트에서 사용자의 로그인 여부 확인

<aside>
💡

Q. 클라이언트에서 사용자의 로그인 여부를 확인하는 과정이 일반적인가요?

Q-1. 만약 그렇다면, 쿠키를 이용하여 로그인 여부를 판단할 때, 보안 상 문제는 없을까요?

Q-2. 그렇지 않다면, 중복되는 코드를 최소화하면서 로그인 페이지를 렌더링하기 위해서 어떤 방식을 사용해야 할까요?

</aside>

현재 제가 작업하고 있는 프론트엔드에는 두 가지의 페이지가 존재합니다.

1. **MainMemberPage : 로그인O**

   ![https://images2.imgbox.com/45/4a/EyYnw3fc_o.png](https://images2.imgbox.com/45/4a/EyYnw3fc_o.png)

2. **MainGuestPage : 로그인X**

   ![https://images2.imgbox.com/ba/0a/4fyrke2K_o.png](https://images2.imgbox.com/ba/0a/4fyrke2K_o.png)

보이는 것처럼 두 페이지는 거의 유사한 형태입니다.

처음에는 두 페이지를 따로 만들었지만 중복 코드를 줄이기 위해 `mainPage.html` 을 작성하고, 이를 클라이언트에서 렌더링하여 `mainMemberPage` 또는 `mainGuestPage` 를 보여주게 하였습니다.

이때 로그인 여부 기준으로 렌더링을 진행하게 되는데, 현재는 이를 쿠키 여부로 판단하게 하였습니다.

```tsx
// static/script/mainPage.js

const mainPage = async () => {
    const nickname = getCookie('nickname');
    if (nickname) {
        mainMemberPage();
    } else {
        mainGuestPage();
    }
```

이러한 방식은 사용자가 쿠키값을 조작하여 `mainMemberPage` 가 렌더링 될 수 있다고 생각하여 보안 상 문제가 될 것 같다는 생각이 들었습니다.

## Router 맵핑

<aside>
💡

Q. 현재 Router 맵핑 방식을 어떻게 개선할 수 있을까요?

</aside>

저는 다음과 같은 방식으로 `Request` 에 대해 적절한 라우터를 맵핑하였습니다.

```tsx
// BE/web_server/core/Middleware/Middleware.ts
// MiddlewareHandler.matchRoute()

static matchRoute(req: Request, path: string) {
      // '/' 경로의 경우 예외적으로 처리
      if(path === '/' && req.path[0] === '/') return true;
      const [_, primaryPath] = req.path.split('/');
      return '/' + primaryPath === path;
  }
```

- `req.path` 에는 클라이언트 요청에 대한 경로가 들어갑니다. (e.g. `'/was/staticfile'` )
- 서버의 `Router` 객체는 `{path: Router}` 형식으로 저장되어 있습니다. (e.g. `{ '/was' : staticRouter}`

위의 상황에서 `req.path` 와 서버의 `path` 를 매칭시키키 위해 `matchRoute()` 메소드를 사용합니다.

`matchRoute()` 에서는 `req.path = '/was/staticfile'` 의 첫 번째 경로인 `primaryPath = '/was'`를 분리시켜 `path = '/was'` 와 비교하게 됩니다.

이 경우 `req.path = '/'` 일 경우 문제가 발생하기 때문에 예외적으로 처리해놓았습니다.

현재 방식은 `Router` 가 등록된 경로가 `path = '/user/login'` 과 같이 여러 개의 경로 조합으로 이루어져 있을 경우 사용하지 못한다는 문제가 있습니다. (`req.path` 의 `primaryPath` 만을 확인하기 때문)

</div>
</details>

<details>
<summary>Review Week3-4</summary>
<div markdown="1">

## Review

### DB와 Redis 간의 동시성 문제

Q. 아래 코드에서 DB와 Redis 간의 동시성 문제가 발생 가능성이 있을까요? 그렇다면 어떤 방식으로 개선할 수 있을까요?

```tsx
// BE/controller/postController.ts
// 'getPostById' Method

// Redis 초기값이 없을 시, DB의 조회수로 초기화
await redisClient.hSetNX(
  "post_view_count",
  String(req.params.id),
  String(post.view_count || 0)
);

// Redis의 조회수 1증가, DB 조회수와 비교 및 업데이트
const viewCount = await redisClient.hIncrBy(
  "post_view_count",
  String(req.params.id),
  1
);
if (viewCount - post.view_count > VIEW_COUNT_UPDATE_THRESHOLD)
  await postDao.update(new Post({ id: req.params.id, view_count: viewCount }));
```

현재 Redis를 이용하여 게시물(post)의 조회수(view_count)를 관리하고 있습니다.

만약 Redis의 조회수(`viewCount` )와 DB의 조회수(`post.view_count` )가 `VIEW_COUNT_UPDATE_THRESHOLD` 으로 차이나게 되면, Redis의 데이터를 DB로 업데이트 하는 방식입니다.

위의 코드에서 redis에 정보를 업데이트하는 부분은 `hSetNX` 와 `hIncrBy` 로, 두 번입니다.

따라서 두 명의 사용자가 동시에 `getPostById` 를 요청하게 되면, 두 명 모두가 초기 값을 설정하거나, 조회수를 증가시키는 동시성 문제가 있을 수 있다고 생각했습니다.

---

### 프론트엔드에서 이전글, 다음글

Q. Post Detail 페이지의 렌더링 과정에서 API 호출이 너무 많아 보입니다. 일반적으로 이전글 / 다음글 버튼을 어떤 방식으로 렌더링 하는지 궁금합니다.

![https://images2.imgbox.com/cf/84/1qhc2SHj_o.png](https://images2.imgbox.com/cf/84/1qhc2SHj_o.png)

위의 이미지는 프론트에서 글의 내용을 보여주는 Post Detail 페이지입니다.

아래에 존재하는 이전글과 다음글 버튼은 href 태그를 이용하여 지정된 주소로 창을 이동시키는 역할을 하고 있습니다.

```tsx
// static/srcipts/postDetailPage.js

const getPostMoveButton = async () => {
  const [postId, _] = getPostIdAndPageNumber();
  const { nextPostId, prevPostId } = await fetchPrevAndNextPostId(postId);
  const nextPostPageNumber = nextPostId
    ? await fetchPageByPostId(nextPostId)
    : null;
  const prevPostPageNumber = prevPostId
    ? await fetchPageByPostId(prevPostId)
    : null;

  // 해당하는 post의 id, page number를 url에 담아 href에 지정
  return [
    button({
      id: "prev",
      text: "이전",
      size: "small",
      disabled: prevPostId ? false : true,
      href: `/${STATIC_URL}/post#page=${prevPostPageNumber}&post=${prevPostId}`,
    }),
    button({
      id: "next",
      text: "다음",
      size: "small",
      disabled: nextPostId ? false : true,
      href: `/${STATIC_URL}/post#page=${nextPostPageNumber}&post=${nextPostId}`,
    }),
  ];
};
```

이전, 다음글 버튼은 페이지가 Post Detail 페이지가 렌더링 되는 순간에 이전글, 다음글 페이지의 URL을 계산하여 href 태그에 지정하고 있습니다.

제 생각에는 Post Detail 페이지를 로드할 때, 이전 / 다음 페이지의 post ID와 page Number를 계산하기 위해 필요한 API호출이 너무 많다고 생각됩니다.

---

</div>
</details>

<details>
<summary>Review Week5-6</summary>
<div markdown="1">

## Review

### 정적 파일 캐싱

Q1. Redis를 이용한 캐싱이 인메모리로 직접 구현한 캐싱보다 느린 이유가 제가 추측한 내용이 맞을까요?

Q2. 그렇다면 현업에서 정적 파일 캐싱은 어떤 방식으로 이루어지나요?

처음 구현할 시, 정적파일 캐싱을 위해 redis를 이용하였습니다.

하지만 redis를 이용하여 캐싱할 경우, 캐싱을 하지 않을 때 보다 오히려 응답 속도가 느려지는 문제가 발생하였습니다.

이에 대해 고민해본 결과, 다음과 같은 추측을 하였습니다.

1. redis에서 데이터를 가져올 때, 네트워크 IO로 인한 지연 발생
   1. 테스트 결과 데이터의 크기가 클수록 캐싱 여부에 따른 응답속도 차이가 커졌습니다.
   2. postman을 이용하여 [localhost](http://localhost) 상에서 테스트 하는 환경 문제도 있을 것이라 추측했습니다.
2. 운영체제의 메모리 캐싱 기능
   1. 운영체제에서 정적파일에 대해 자체적으로 메모리에 캐싱을 하기에 redis를 이용하는 것보다 빠른 응답을 했을 것이라 추측했습니다.

위와 같은 추측을 바탕으로 캐싱 미들웨어가 인메모리에 직접 저장하도록 수정하자, 캐싱을 하지않던 기존보다 응답 시간이 향상되었습니다.

```tsx
// BE/web_server/middlewares/staticCacheMiddleware.ts
// staticMemoryCacheMiddleware
// 위의 경로의 staticRedisCacheMiddleware 메소드는 Redis를 이용한 캐싱 미들웨어입니다.

export const staticMemoryCacheMiddleware = (staticPath: string) => {
  return async (req: Request, res: Response, next: Function) => {
    const filePath = path.join(staticPath, req.path === '/' ? '/mainPage.html' : req.path);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    try {
      // 캐시 조회
      const cachedEntry = memoryCache.get(filePath);
      if (cachedEntry) {
        res.setHeader('Content-Type', cachedEntry.contentType);
        return res.send(cachedEntry.value, contentType);
      }

      // 파일이 없으면 캐시 및 응답 처리
      const stats = await fs.promises.stat(filePath);
      if (!stats.isFile()) {
        console.log(`File not found: ${filePath}`);
        return next();
      }

      const data = await fs.promises.readFile(filePath);

      // 메모리 캐시에 저장
      memoryCache.set(filePath, data, contentType, 60000);

      res.setHeader('Content-Type', contentType);
      res.send(data, contentType);

    } catch (error) {
      if (error.code === 'ENOENT') {
        return next();
      }
      throw new HttpError(500, error.message);
    }
  };
```

</div>
</details>

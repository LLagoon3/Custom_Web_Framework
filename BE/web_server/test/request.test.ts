import { Request } from "../core/Request";

describe('Request Class', () => {
    it('Request 객체가 적절히 파싱을 진행하는 지 테스트', () => {
        const msg = `POST /submit HTTP/1.1\r\nHost: example.com\r\nContent-Type: application/json\r\nContent-Length: 59\r\nCookie: sessionId=abcd1234; userToken=xyz789\r\n\r\n{"username":"johndoe","email":"johndoe@example.com"}`;
    
        const req = new Request(msg);

        // Test method, path, and version
        expect(req.method).toBe('POST');
        expect(req.path).toBe('/submit');
        expect(req.version).toBe('HTTP/1.1');

        // Test headers
        expect(req.headers['Host']).toBe('example.com');
        expect(req.headers['Content-Type']).toBe('application/json');
        expect(req.headers['Content-Length']).toBe('59');

        // Test cookies
        expect(req.cookies['sessionId']).toBe('abcd1234');
        expect(req.cookies['userToken']).toBe('xyz789');

        // Test body
        expect(req.body).toBe('{"username":"johndoe","email":"johndoe@example.com"}');
    });

});
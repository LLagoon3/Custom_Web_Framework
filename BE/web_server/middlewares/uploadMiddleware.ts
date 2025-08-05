import * as fs from 'fs';
import * as path from 'path';
import { Request } from '../core/Request';
import { Response } from '../core/Response';
import * as crypto from 'crypto';


const basePath = path.join(__dirname, '../../../',);


function generateHashedFilename(fileBuffer: Buffer, originalName: string): string {
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const ext = path.extname(originalName);
  return `${hash}${ext}`;
}

export function uploadMiddleware(destination: string) {
    return (req: Request, res: Response, next: Function) => {

        const contentType = req.headers['Content-Type'];
        if (!contentType || !contentType.includes('multipart/form-data')) {
            return next();
        }
        let boundary = contentType.split('; ').find((param) => param.startsWith('boundary='));
        
        if (!boundary) {
            return res.status(400).send('No boundary found in multipart/form-data request.');
        }

        boundary = `--${boundary.replace('boundary=', '')}`;
        const boundaryBuffer = Buffer.from(boundary, 'latin1');
        let dataBuffer = Buffer.alloc(0);

        const files: any[] = [];

        // req의 end 이벤트 등록을 먼저 하고 data 이벤트 등록 할 것!
        req.on('end', () => {
            let start = 0;
            let end = dataBuffer.indexOf(boundaryBuffer, start);

            while (end !== -1) {
                const part = dataBuffer.slice(start, end);
                parsePart(part, files, destination);

                start = end + boundaryBuffer.length;
                end = dataBuffer.indexOf(boundaryBuffer, start);
            }

            // 업로드된 파일 정보를 req 객체에 추가
            req.files = files;
            // 다음 bodyParseMiddleware가 확인할 수 있도록 req.body를 초기화
            req.body = {};

            next();
        });

        // 데이터 수신 처리
        req.on('data', (chunk) => {
            dataBuffer = Buffer.concat([dataBuffer, chunk]);
        });

        // req.on('error', (err) => {
        //     console.error('Error during file upload:', err);
        //     res.status(500).send('File upload error.');
        // });

    };
}

function parsePart(part: Buffer, files: any[], destination: string) {
    const headerEndIndex = part.indexOf('\r\n\r\n');
    if (headerEndIndex === -1) return;

    const headers = part.slice(0, headerEndIndex).toString();
    const fileNameMatch = headers.match(/filename="(.+?)"/);

    if (fileNameMatch) {
        const originalFileName = fileNameMatch[1];
        const contentStart = headerEndIndex + 4;
        const contentEnd = part.lastIndexOf('\r\n');
        
        const fileBuffer = part.slice(contentStart, contentEnd);
        const filename = generateHashedFilename(fileBuffer, originalFileName)
        const filePath = path.join(destination, filename);

        fs.writeFileSync(filePath, fileBuffer);

        files.push({
            fieldName: '',
            name: filename,
            originalName: originalFileName,
            encoding: '7bit',
            mimetype: 'application/octet-stream',
            destination,
            filename,
            path: filePath,
            size: fileBuffer.length,
        });
    }
}

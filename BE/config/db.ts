import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.REDIS_HOST) {
  throw new Error('환경 변수 REDIS_HOST가 설정되지 않았습니다.');
}

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0
});
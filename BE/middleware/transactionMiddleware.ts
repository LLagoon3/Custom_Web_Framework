import { Request } from "../web_server/core/Request";
import { Response } from "../web_server/core/Response";
import { pool } from "../config/db";

export const transactionMiddleware = async (req: Request, res: Response, next: Function) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        req.dbConnection = connection;

        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                try {
                    await connection.commit();
                    // console.log('Transaction committed');
                } catch (err) {
                    console.error('Commit failed:', err);
                }
            } else {
                try {
                    await connection.rollback();
                    console.log('Transaction rolled back');
                } catch (err) {
                    console.error('Rollback failed:', err);
                }
            }
            connection.release();
        });

        next();
    } catch (err) {
        connection.release();
        res.status(500).json({ message: 'Failed to start transaction', error: err });
    }
};
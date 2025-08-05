import { GenericDao } from './GenericDao';
import { User } from '../model/User';

export class UserDao extends GenericDao<User> {
    constructor(dbConnection: any) {
        super('users', dbConnection);
    }

    async findByEmail(email: string): Promise<User | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE email = ?`;
        const [rows]: any = await this.dbConnection.execute(sql, [email]);
        if (rows.length > 0) {
            return rows[0] as User;
        }
        return null;
    }
}
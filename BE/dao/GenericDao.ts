import { IGenericDao } from './IGenericDao';

export class GenericDao<T> implements IGenericDao<T> {
    protected tableName: string;
    protected dbConnection: any;

    constructor(tableName: string, dbConnection: any) {
        this.tableName = tableName;
        this.dbConnection = dbConnection;
    }

    async create(item: T): Promise<number> {
        const filteredEntries = Object.entries(item).filter(([_, value]) => value !== null);
        const filteredObject = Object.fromEntries(filteredEntries);
        const columns = Object.keys(filteredObject).join(', ');
        const values = Object.values(filteredObject).map(() => '?').join(', ');
        const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${values})`;
        const [result]: any = await this.dbConnection.execute(sql, Object.values(filteredObject));
        return result.insertId;
    }

    async findById(id: number): Promise<T | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const [rows]: any = await this.dbConnection.execute(sql, [id]);
        if (rows.length > 0) {
            return rows[0] as T;
        }
        return null;
    }

    async findAll(): Promise<T[]> {
        const sql = `SELECT * FROM ${this.tableName}`;
        const [rows]: any = await this.dbConnection.execute(sql);
        return rows as T[];
    }

    async update(item: T): Promise<boolean> {
        const filteredEntries = Object.entries(item).filter(([_, value]) => value !== null);
        const filteredObject = Object.fromEntries(filteredEntries);
        const columns = Object.keys(filteredObject).map(key => `${key} = ?`).join(', ');
        const sql = `UPDATE ${this.tableName} SET ${columns} WHERE id = ?`;
        const [result]: any = await this.dbConnection.execute(sql, [...Object.values(filteredObject), (item as any).id]);
        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const [result]: any = await this.dbConnection.execute(sql, [id]);
        return result.affectedRows > 0;
    }

}
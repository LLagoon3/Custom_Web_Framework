import { GenericDao } from './GenericDao';
import { Post } from '../model/Post';

export class PostDao extends GenericDao<Post> {
    constructor(dbConnection: any) {
        super('posts', dbConnection);
    }

    async findById(postId: number): Promise<Post | null> {
        const sql = `
            SELECT posts.*, users.nickname 
            FROM ${this.tableName} 
            JOIN users ON posts.author = users.id 
            WHERE posts.id = ?;
            `;
        const [rows]: any = await this.dbConnection.execute(sql, [postId]);
        if (rows.length === 0) {
            throw new Error('Post not found');
        }
        return rows[0];
    }

    async findByPage(page: number): Promise<Post[]> {
        // OFFSET에 대해 플레이스 홀더 작동 안함, 확인 필요
        // const sql = `SELECT * FROM ${this.tableName} ORDER BY id DESC LIMIT 10 OFFSET ${(page - 1) * 10}`;
        const sql = `
            SELECT posts.*, users.nickname 
            FROM ${this.tableName} 
            JOIN users ON posts.author = users.id 
            ORDER BY posts.id DESC 
            LIMIT 10 
            OFFSET ${(page - 1) * 10};
        `;
        const [rows]: any = await this.dbConnection.execute(sql); //[(page - 1) * 5]
        return rows as Post[];
    }

    async findPrevAndNextPostId(postId: number): Promise<{ prevPostId: number | null, nextPostId: number | null }> {
        const previousPostSql = `SELECT id FROM posts WHERE id < ? ORDER BY id DESC LIMIT 1`;
        const [previousRows]: any = await this.dbConnection.execute(previousPostSql, [postId]);
        const prevPostId = previousRows.length > 0 ? previousRows[0].id : null;

        const nextPostSql = `SELECT id FROM posts WHERE id > ? ORDER BY id ASC LIMIT 1`;
        const [nextRows]: any = await this.dbConnection.execute(nextPostSql, [postId]);
        const nextPostId = nextRows.length > 0 ? nextRows[0].id : null;

        return {
            prevPostId,
            nextPostId
        };
    }

    async findPageById(postId: number): Promise<number> {
        const sql = `SELECT COUNT(*) AS position FROM ${this.tableName} WHERE id > ?`;
        const [rows]: any = await this.dbConnection.execute(sql, [postId]);

        const position = rows[0]?.position;
        if (position === undefined || position === null) {
            return null;
        }

        const pageSize = 10;
        const pageNumber = Math.ceil((position + 1) / pageSize);  // position은 0-based이므로 +1

        return pageNumber;
    }

    async searchByKeyword(keyword: string): Promise<Post[]> {
        // const sql = `SELECT * FROM ${this.tableName} WHERE title LIKE ? OR content LIKE ?`;
        const sql = `
            SELECT posts.*, users.nickname 
            FROM ${this.tableName} 
            JOIN users ON posts.author = users.id 
            WHERE posts.title LIKE ? OR posts.content LIKE ?;
        `;
        const searchKeyword = `%${keyword}%`;
        const [rows]: any = await this.dbConnection.execute(sql, [searchKeyword, searchKeyword]);
        return rows;
    }

    async countPosts(): Promise<number> {
        const sql = `SELECT COUNT(*) AS total_posts FROM ${this.tableName};`;
        const [rows]: any = await this.dbConnection.execute(sql);
        return rows[0]['total_posts'];
    }

}
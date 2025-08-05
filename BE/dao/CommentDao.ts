import { GenericDao } from "./GenericDao";
import { Comment } from "../model/Comment";

export class CommentDao extends GenericDao<Comment> {
    constructor(dbConnection: any) {
        super('comments', dbConnection);
    }

    async findByPostId(postId: number): Promise<Comment[]> {
        const sql = `
            SELECT comments.*, users.nickname
            FROM ${this.tableName}
            JOIN users ON comments.author = users.id
            WHERE comments.post_id = ?;
        `
        const [rows]: any = await this.dbConnection.execute(sql, [postId]);
        return rows as Comment[];
    }
}
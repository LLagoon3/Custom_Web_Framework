import { GenericDao } from './GenericDao';
import { Image } from '../model/Image';

export class ImageDao extends GenericDao<Image> {
    constructor(dbConnection: any) {
        super('images', dbConnection);
    }

    async findByPostId(postId: number): Promise<Image[]> {
        const sql = `
            SELECT images.*, users.nickname
            FROM ${this.tableName}
            JOIN users ON images.author = users.id
            WHERE post_id = ?;
            `;
        const [rows]: any = await this.dbConnection.execute(sql, [postId]);
        return rows as Image[];
    }
}
export class Comment {
    public id: number | null;
    public created_at: Date | null;
    public content: string | null;
    public author: string | null;
    public post_id: number | null;

    constructor({ id = null, created_at = null, content = null, author = null, post_id = null }) {
        this.id = id;
        this.created_at = created_at;
        this.content = content;
        this.author = author;
        this.post_id = post_id;
    }
}
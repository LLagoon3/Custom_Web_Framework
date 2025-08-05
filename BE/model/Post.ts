export class Post {
    public id: number | null;
    public created_at: Date | null;
    public title: string;
    public content: string;
    public author: string;
    public view_count: number;

    constructor({ id = null, created_at = null, title = null, content = null, author = null, view_count = null }) {
        this.id = id;
        this.created_at = created_at;
        this.title = title;
        this.content = content;
        this.author = author;
        this.view_count = view_count;
    }
}

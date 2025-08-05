export class Image{
    public id: number | null;
    public post_id: number | null;
    public author: string | null;
    public file_path: string | null;
    public created_at: Date | null;
    public file_name: string | null;
    public file_original_name: string | null;
    public file_size: number | null;

    constructor({ id = null, postId = null, author = null, filePath = null, fileName = null, created_at = null, fileOriginalName = null, fileSize = null,}) {
        this.id = id;
        this.post_id = postId;
        this.author = author;
        this.created_at = created_at;
        this.file_name = fileName;
        this.file_original_name = fileOriginalName;
        this.file_path = filePath;
        this.file_size = fileSize;
    }
}
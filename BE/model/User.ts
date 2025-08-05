export class User {
    public id: number | null;
    public nickname: string;
    public email: string;
    public password: string;

    constructor({ nickname, email, password, id = null }) {
        this.id = id;
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }
}

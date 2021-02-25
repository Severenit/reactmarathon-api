const randomId = () => {
    return Math.floor(Math.random() * 100);
};

export class User {
    constructor(username) {
        this.username = username;
        this.userId = randomId();
    }
}

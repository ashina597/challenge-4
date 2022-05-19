"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Todo {
    todoid;
    todotitle;
    tododescription;
    constructor(todoid, todotitle, tododescription) {
        this.todoid = todoid;
        this.todotitle = todotitle;
        this.tododescription = tododescription;
    }
}
exports.default = Todo;

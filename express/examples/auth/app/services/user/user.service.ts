import { Injectable } from "@vigilio/express-core";

@Injectable()
export class UserService {
    async index() {}

    async show(id: string) {
        return id;
    }

    async store() {}

    async update() {}

    async destroy(id: string) {
        return id;
    }
}

import Session from "./session.model";

export default class Player {
    id: string;
    name: string;
    currentSessionId: string;
    constructor(name: string, id: string) {
        this.id = id;
        this.name = name;
        this.currentSessionId = '';
    }

    public updateSessionId(id: string) {
        this.currentSessionId = id;
    }
}
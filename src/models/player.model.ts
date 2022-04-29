import Meme from "./meme.model";

export default class Player {
    id: string;
    name: string;
    currentSessionId: string;
    score: number;
    private _cards: Array<Meme>;
    constructor(name: string, id: string) {
        this.id = id;
        this.name = name;
        this.score = 0;
        this._cards = [];
        this.currentSessionId = '';
    }

    public updateSessionId(id: string) {
        this.currentSessionId = id;
    }

    public updateCards(cards: Array<Meme>) {
        this._cards = cards;
    }
}
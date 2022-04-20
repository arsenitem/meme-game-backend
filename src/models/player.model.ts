import Meme from "./meme.model";

export default class Player {
    id: string;
    name: string;
    currentSessionId: string;
    score: number;
    cards: Array<Meme>;
    constructor(name: string, id: string) {
        this.id = id;
        this.name = name;
        this.score = 0;
        this.cards = [];
        this.currentSessionId = '';
    }

    public updateSessionId(id: string) {
        this.currentSessionId = id;
    }

    public updateCards(cards: Array<Meme>) {
        this.cards = cards;
    }
}
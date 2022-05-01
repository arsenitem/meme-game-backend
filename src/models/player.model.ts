import Card from "./card.model";

export default class Player {
    id: string;
    name: string;
    currentSessionId: string;
    score: number;
    _cards: Array<Card>;
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

    public updateCards(cards: Array<Card>) {
        this._cards = cards;
    }

    public removeCardById(cardId: string) {
        this._cards = this._cards.filter((card: Card) => card.id !== cardId);
    }

    public getCardById(cardId: string) {
        const card = this._cards.find((card: Card) => card.id === cardId);
        return card;
    }

    public addCard(card: Card) {
        this._cards.push(card);
    }
}
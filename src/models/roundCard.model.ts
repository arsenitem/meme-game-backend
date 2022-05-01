import { v4 as uuidv4 } from 'uuid';
import Card from './card.model';
export default class RoundCard extends Card {
    playerId: string;
    votes: number;
    constructor(id: string = uuidv4(), link: string, playerId: string) {
        super(id, link);
        this.playerId = playerId;
        this.votes = 0;
    }

    public vote() {
        this.votes++;
    }
}
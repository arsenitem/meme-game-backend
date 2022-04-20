import Player from './../models/player.model';
import Session from './../models/session.model';
import Meme from './../models/meme.model';
export default {
    activeSessions: [] as Array<Session>,
    activePlayers: [] as Array<Player>,
    cards: [] as Array<Meme>
};
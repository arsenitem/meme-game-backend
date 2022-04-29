import Player from './../models/player.model';
import Session from './../models/session.model';
import Meme from './../models/meme.model';
import Question from '../models/question.model';
export default {
    activeSessions: [] as Array<Session>,
    activePlayers: [] as Array<Player>,
    cards: [] as Array<Meme>,
    questions: [] as Array<Question>,
};
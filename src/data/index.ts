import Player from './../models/player.model';
import Session from './../models/session.model';
import Card from './../models/card.model';
import Question from '../models/question.model';
export default {
    activeSessions: [] as Array<Session>,
    activePlayers: [] as Array<Player>,
    cards: [] as Array<Card>,
    questions: [] as Array<Question>,
};
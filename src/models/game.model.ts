import Card from "./card.model";
import Question from "./question.model";
import { getCards, getQuestions } from "../services/dataService";
import RoundCard from "./roundCard.model";
export default class Game {
    activeQuestion: Question | null;
    round: number;
    roundCards: Array<RoundCard>;
    cardsList: Array<Card>;
    playedCardsList: Array<RoundCard>;
    questionsList: Array<Question>;

    constructor() {
        this.activeQuestion = null;
        this.round = 0;
        this.roundCards = [];
        this.playedCardsList = [];
        this.cardsList = getCards();
        this.questionsList = getQuestions();
    }
}
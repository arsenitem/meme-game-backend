import Meme from "./meme.model";
import Question from "./question.model";
import { getMemes, getQuestions } from "../services/dataService";
export default class Game {
    activeQuestion: Question | null;
    round: number;
    roundCards: Array<Meme>;
    cardsList: Array<Meme>;
    playedCardsList: Array<Meme>;
    questionsList: Array<Question>;

    constructor() {
        this.activeQuestion = null;
        this.round = 0;
        this.roundCards = [];
        this.playedCardsList = [];
        this.cardsList = getMemes();
        this.questionsList = getQuestions();
    }
}
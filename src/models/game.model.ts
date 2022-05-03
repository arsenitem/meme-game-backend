import Card from "./card.model";
import Question from "./question.model";
import { getCards, getQuestions } from "../services/dataService";
import RoundCard from "./roundCard.model";
import { RoundStatusEnum } from '../enums/roundStatusEnum';
import Player from "./player.model";
export default class Game {
    activeQuestion: Question | null;
    round: number;
    roundStatus: RoundStatusEnum;
    roundCards: Array<RoundCard>;
    cardsList: Array<Card>;
    playedCardsList: Array<RoundCard>;
    playersVoted: Array<Player>;
    questionsList: Array<Question>;

    constructor() {
        this.activeQuestion = null;
        this.round = 0;
        this.roundStatus = RoundStatusEnum.notStarted;
        this.roundCards = [];
        this.playedCardsList = [];
        this.playersVoted = [];
        this.cardsList = getCards();
        this.questionsList = getQuestions();
    }
}
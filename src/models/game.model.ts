export default class Game {
    activeQuestion: string;
    round: number;
    cardsList: Array<string>;
    questionsList: Array<string>;

    constructor(cardsList: Array<string>, questionsList: Array<string>) {
        this.activeQuestion = '';
        this.round = 0;
        this.cardsList = cardsList;
        this.questionsList = questionsList;
    }
}
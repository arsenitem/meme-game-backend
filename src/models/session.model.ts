import Player from './player.model';
import { v4 as uuidv4 } from 'uuid';
import Game from './game.model';
import Settings from './settings.model';
export default class Session {
    id: string;
    name: string;
    host: Player;
    players: Array<Player>;
    settings: Settings
    game: Game;

    constructor(name: string, host: Player, settings: Settings, game: Game) {
        this.id = uuidv4();
        this.name = name;
        this.host = host;
        this.players = [];
        this.settings = settings;
        this.game = game;
    }

    public addPlayer(player: Player) {
        if (!this.players.includes(player)) {
            this.players.push(player);
        }
    }

    public removePlayer(playerRemove: Player) {
        this.players = this.players.filter((player) => player.id !== playerRemove.id);
    }
    public moveRoundCardsToPlayed() {
        this.game.playedCardsList.push(...this.game.roundCards);
    }

    public incrementRound() {
        this.game.round++;
    }

    public dealCards() {
        this.players.forEach((player) => {
            const playerCards = this.game.cardsList.splice(0, 6);
            player.updateCards(playerCards);
        });
    }

    public provideRoundQuesion() {
        this.game.activeQuestion = this.game.questionsList.pop() || null;
    }

    public shuffleCards() {
        //TODO Edit sorting algorithm
        this.game.questionsList = this.game.questionsList.sort(() => 0.5 - Math.random());
        this.game.cardsList = this.game.cardsList.sort(() => 0.5 - Math.random());
    }
    public start() {
        //перемешать карты вопросов
        //перемешать карты мемов
        //инкремент номера раунда
        //раздать карты удалив из колоды
        //запустить вопрос удалив из колоды
        //запустить таймер
        //голосование
        //выбор самой смешной карточки
        //начисление очков владельцу карточки
        //раздать еще карты
        //повторить
        
        // this.players.forEach((player) => {
        //     player.updateCards();

        // })
    }
}
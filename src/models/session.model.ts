import Player from './player.model';
import { v4 as uuidv4 } from 'uuid';
import Game from './game.model';
import Settings from './settings.model';
import RoundCard from './roundCard.model';
import { RoundStatusEnum } from '../enums/roundStatusEnum';
import { findMaxVoteCards } from '../utils/arrayHelper';

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
    private getPlayerById(playerId: string) {
        return this.players.find((player: Player) => player.id === playerId);
    }
    public removePlayer(playerRemove: Player) {
        this.players = this.players.filter((player) => player.id !== playerRemove.id);
    }
    public moveRoundCardsToPlayed() {
        this.game.playedCardsList.push(...this.game.roundCards);
        this.game.roundCards = [];
    }

    public incrementRound() {
        this.game.round++;
    }

    public dealCards() {
        this.players.forEach((player: Player) => {
            const cardsNumToAdd = 6 - player._cards.length
            const playerCards = this.game.cardsList.splice(0, cardsNumToAdd);
            player.addCards(playerCards);
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

    public pickCard(playerId: string, cardId: string) {
        const player = this.getPlayerById(playerId);
        const card = player?.getCardById(cardId);
        player?.removeCardById(cardId)
        if (card) {
            this.game.roundCards.push(new RoundCard(card.id, card.link, playerId));
        }
    }

    public voteCard(cardId: string) {
        const card = this.game.roundCards.find((card: RoundCard) => card.id === cardId);
        card?.vote();
    }

    public updateRoundStatus(status: RoundStatusEnum) {
        this.game.roundStatus = status;
    }
    public calcRoundScore() {
        const maxVoteCards = findMaxVoteCards(this.game.roundCards);
        maxVoteCards.forEach((maxVoteCard: RoundCard) => {
            const player = this.getPlayerById(maxVoteCard.playerId);
            player?.incrementScore();
        });
    }
    // public startRound() {

    // }

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
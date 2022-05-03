import Player from './player.model';
import { v4 as uuidv4 } from 'uuid';
import Game from './game.model';
import Settings from './settings.model';
import RoundCard from './roundCard.model';
import { RoundStatusEnum } from '../enums/roundStatusEnum';
import { findMaxVoteCards } from '../utils/arrayHelper';
import { sample, shuffle } from 'lodash';

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
        this.game.questionsList = shuffle(this.game.questionsList);
        this.game.cardsList = shuffle(this.game.cardsList);
    }

    public pickCard(playerId: string, cardId: string) {
        if (this.game.roundStatus === RoundStatusEnum.picking) {
            const player = this.getPlayerById(playerId);
            const card = player?.getCardById(cardId);
            if (card && !player?.pickedCard) {
                player?.removeCardById(cardId)
                this.game.roundCards.push(new RoundCard(card.id, card.link, playerId));
                player?.updatePickedCard(true);
            }
        } 
    }

    public voteCard(playerId: string, cardId: string) {
        if (this.game.roundStatus === RoundStatusEnum.voting) {
            const card = this.game.roundCards.find((card: RoundCard) => card.id === cardId);
            const player = this.getPlayerById(playerId);
            if (!player?.voted) {
                card?.vote();
                player?.updateVoted(true);
                if (player) {
                    this.game.playersVoted.push(player);
                }  
            }      
        }
    }

    public updateRoundStatus(status: RoundStatusEnum) {
        this.game.roundStatus = status;
    }

    public pickRandomCardPlayers() {
        const notPicked = this.players.filter((player: Player) => !player.pickedCard);
        notPicked.forEach((player: Player) => {
            const randomCardToPick = sample(player._cards)
            if (randomCardToPick) {
                this.pickCard(player.id, randomCardToPick.id);
            } 
        })
    }
    public voteRandomCardPlayers() {
        const notVoted = this.players.filter((player: Player) => !player.voted);
        notVoted.forEach((player: Player) => {
            const randomCardToVote = sample(this.game.roundCards);
            if (randomCardToVote) {
                this.voteCard(player.id, randomCardToVote.id);
            } 
        })
    }
    public calcRoundScore() {
        const maxVoteCards = findMaxVoteCards(this.game.roundCards);
        maxVoteCards.forEach((maxVoteCard: RoundCard) => {
            const player = this.getPlayerById(maxVoteCard.playerId);
            player?.incrementScore();
        });
    }

    public endRound() {
        this.game.playedCardsList.push(...this.game.roundCards);
        this.game.roundCards = [];
        this.game.playersVoted = [];
        this.players.forEach((player: Player) => {
            player.updatePickedCard(false);
            player.updateVoted(false);
        })
    }

    public isAllVoted() {
        return this.players.every((player: Player) => player.voted);
    }
}
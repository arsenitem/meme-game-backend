import Player from './player.model';
import Meme from './meme.model';
import {getQuestions, getMemes} from '../services/dataService';
import { v4 as uuidv4 } from 'uuid';
export default class Session {
    id: string;
    name: string;
    host: Player;
    players: Array<Player>;

    settings: {
        maxPlayers: number;
        maxRounds: number;
        roundTime: number;
        voteTime: number;
        password?: string;
    }

    game: {
        activeQuestion: string;
        round: number,
        cardsList: Array<Meme>;
        roundCards: Array<Meme>;
        playedCardsList: Array<Meme>;
        questionsList: Array<string>;
    }

    constructor(name: string, host: Player, maxPlayers: number = 6, maxRounds: number = 25,roundTime: number = 60,voteTime:number = 60, password?: string) {
        this.id = uuidv4();
        this.name = name;
        this.host = host;
        this.players = [];
        this.settings = {
            maxPlayers,
            maxRounds,
            roundTime,
            voteTime,
            password
        }
        this.game = {
           activeQuestion: '',
           round: 0,
           roundCards: [],
           cardsList: [],
           playedCardsList: [],
           questionsList: getQuestions(),
        }
    }

    public addPlayer(player: Player) {
        this.players.push(player);
    }

    public removePlayer(playerRemove: Player) {
        this.players = this.players.filter((player) => player !== playerRemove);
    }
    public moveRoundCardsToPlayed() {
        this.game.playedCardsList.push(...this.game.roundCards);
    }
    public start() {
        this.game.round = 1;

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
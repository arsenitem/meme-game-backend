import Player from './player.model';
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
    }

    public addPlayer(player: Player) {
        this.players.push(player);
    }

    public removePlayer(playerRemove: Player) {
        this.players = this.players.filter((player) => player !== playerRemove);
    }
}
import Player from './player.model';
export default class Session {
    name: string;
    host: Player;
    maxPlayers: number;
    players: Array<Player>;

    constructor(name: string, host: Player, maxPlayers: number) {
        this.name = name;
        this.host = host;
        this.maxPlayers = maxPlayers;
        this.players = [];
    }
}
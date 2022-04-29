export default class Settings {
    maxPlayers: number;
    maxRounds: number;
    roundTime: number;
    voteTime: number;
    password?: string;

    constructor(maxPlayers: number = 6, maxRounds: number = 15, roundTime: number = 60, voteTime: number = 30, password?: string) {
        this.maxPlayers = maxPlayers;
        this.maxRounds = maxRounds;
        this.roundTime = roundTime;
        this.voteTime = voteTime;
        this.password = password;
    }
}
export default class Settings {
    maxPlayers: number;
    maxRounds: number;
    roundTime: number;
    voteTime: number;
    beforeNextRoundTime: number;
    password?: string;

    constructor(maxPlayers: number = 6, maxRounds: number = 4, roundTime: number = 30, beforeNextRoundTime = 6, voteTime: number = 15, password?: string) {
        this.maxPlayers = maxPlayers;
        this.maxRounds = maxRounds;
        this.roundTime = roundTime;
        this.beforeNextRoundTime = beforeNextRoundTime
        this.voteTime = voteTime;
        this.password = password;
    }
}
import Session from "../models/session.model";
import { getSessionById } from "./dataService";
import { Server } from "socket.io";
import { RoundStatusEnum } from '../enums/roundStatusEnum';
import { addProxySet } from "../utils/proxy";
import Player from "../models/player.model";
import { once } from "lodash";
export default class GameService {
    io: Server;
    addedProxyPick: boolean;
    addedProxyVote: boolean;
    resolveFunc: Function | null;
    constructor(io: Server) {
        this.io = io;
        this.addedProxyPick = false;
        this.addedProxyVote = false;
        this.resolveFunc = null;
    }

    playerPickCard = (sessionId: string, cardId: string, playerId: string) => {
        const session = getSessionById(sessionId);
        session?.pickCard(playerId, cardId);
        this.io.to(sessionId).emit('session:status', session);
        if (session?.game.roundCards.length === session?.players.length) {
            console.log('evet')
            if (this.resolveFunc) {
                this.resolveFunc();
            }
        }
    }

    playerVoteCard = (sessionId: string, cardId: string, playerId: string) => {
        const session = getSessionById(sessionId);
        session?.voteCard(playerId, cardId);
        this.io.to(sessionId).emit('session:status', session);
        if (session?.game.playersVoted.length === session?.players.length) {
            if (this.resolveFunc) {
                this.resolveFunc();
            }
        }
    }

    getSessionStatus = (sessionId: string) => {
        const session = getSessionById(sessionId);
        this.io.to(sessionId).emit('session:status', session);
    }

    waitBeforeNext = async(session: Session) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, session.settings.beforeNextRoundTime * 1000);
        })
    }
    
    waitSecondsOrCardsPick = async (session: Session) => {
        return new Promise((resolve, reject) => {
            this.resolveFunc = resolve;
            const timeout = setTimeout(() => {
                resolve(true);
            }, session.settings.roundTime * 1000);
            // if (!this.addedProxyPick) {
            //     session.game = addProxySet(session.game, () => {
            //         if (session.game.roundCards.length === session.players.length) {
            //             clearTimeout(timeout);
            //             resolve(true);
            //         }        
            //     }, 'roundCards');
            //     this.addedProxyPick = true;
            // }
        })   
    }
    waitSecondsOrVote = async (session: Session) => {
        return new Promise((resolve, reject) => {
            this.resolveFunc = resolve;
            const timeout = setTimeout(() => {
                resolve(true);
            }, session.settings.voteTime * 1000);
            // if (!this.addedProxyVote) {
            //     session.game = addProxySet(session.game, () => {
            //         if (session.game.playersVoted.length === session.players.length) {
            //             clearTimeout(timeout);
            //             resolve(true);
            //         }        
            //     }, 'playersVoted');
            //     console.log('added proxy')
            //     this.addedProxyVote = true;
            // }    
        })   
    }
    startSession = async (sessionId: string) => {
        const session = getSessionById(sessionId);
        this.io.to(sessionId).emit('session:started');
        if (session) {
            session.shuffleCards();
            while (session.game.round < session.settings.maxRounds) {
                await this.newRound(session);
                console.log(session.game.round);
            }
        }
    }

    newRound = async (session: Session) => {
        return new Promise(async (resolve) => {
            if (session) {
                console.log('starting new round');
                session.incrementRound();
                session.provideRoundQuesion();
                session.dealCards();
                console.log('status will be emited');
                this.io.to(session.id).emit('session:status', session);
                console.log('status emited');
                session.updateRoundStatus(RoundStatusEnum.picking);
                console.log('picking');
                this.io.to(session.id).emit('session:status', session);
                await this.waitSecondsOrCardsPick(session);
                console.log('cards picked');
                session.pickRandomCardPlayers();
                session.updateRoundStatus(RoundStatusEnum.voting);
                this.io.to(session.id).emit('session:status', session);
                await this.waitSecondsOrVote(session);
                session.voteRandomCardPlayers();
                this.io.to(session.id).emit('session:status', session);
                session.calcRoundScore()
                this.io.to(session.id).emit('session:status', session);
                session.updateRoundStatus(RoundStatusEnum.beforeRound);
                this.io.to(session.id).emit('session:status', session);
                console.log('voting end')
                await this.waitBeforeNext(session);
                session.endRound();
                this.io.to(session.id).emit('session:status', session);
                console.log('round end')
                resolve(true); 
            }
        })
    }
}

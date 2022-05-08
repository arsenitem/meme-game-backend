import Session from "../models/session.model";
import { getSessionById } from "./dataService";
import { Server } from "socket.io";
import { RoundStatusEnum } from '../enums/roundStatusEnum';
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
        })   
    }
    waitSecondsOrVote = async (session: Session) => {
        return new Promise((resolve, reject) => {
            this.resolveFunc = resolve;
            const timeout = setTimeout(() => {
                resolve(true);
            }, session.settings.voteTime * 1000);  
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

    joinSession = async (sessionId: string) => {
        const session = getSessionById(sessionId);
        this.io.to(sessionId).emit('session:joined');
        
    }

    newRound = async (session: Session) => {
        return new Promise(async (resolve) => {
            if (session) {
                session.incrementRound();
                session.provideRoundQuestion();
                session.dealCards();
                this.io.to(session.id).emit('session:status', session);
                session.updateRoundStatus(RoundStatusEnum.picking);
                this.io.to(session.id).emit('session:status', session);
                await this.waitSecondsOrCardsPick(session);
                session.pickRandomCardPlayers();
                session.updateRoundStatus(RoundStatusEnum.voting);
                this.io.to(session.id).emit('session:status', session);
                await this.waitSecondsOrVote(session);
                session.voteRandomCardPlayers();
                this.io.to(session.id).emit('session:status', session);
                session.calcRoundScore()
                session.updateRoundStatus(RoundStatusEnum.beforeRound);
                this.io.to(session.id).emit('session:status', session);
                await this.waitBeforeNext(session);
                session.endRound();
                this.io.to(session.id).emit('session:status', session);
                resolve(true); 
            }
        })
    }
}

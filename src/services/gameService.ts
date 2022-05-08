import Session from "../models/session.model";
import { getSessionById, removeSession } from "./dataService";
import { Server } from "socket.io";
import { RoundStatusEnum } from '../enums/roundStatusEnum';
export default class GameService {
    io: Server;
    addedProxyPick: boolean;
    addedProxyVote: boolean;
    resolver: Function | null;
    timer: any | null;
    constructor(io: Server) {
        this.io = io;
        this.addedProxyPick = false;
        this.addedProxyVote = false;
        this.resolver = null;
        this.timer = null;
    }

    playerPickCard = (sessionId: string, cardId: string, playerId: string) => {
        const session = getSessionById(sessionId);
        session?.pickCard(playerId, cardId);
        this.io.to(sessionId).emit('session:status', session);
        console.log(this.resolver);
        if (session?.game.roundCards.length === session?.players.length) {
            console.log('evet')
            if (this.resolver) {
                console.log('resolve pick exists')
                this.resolver();
                clearTimeout(this.timer);
            }
        }
    }

    playerVoteCard = (sessionId: string, cardId: string, playerId: string) => {
        const session = getSessionById(sessionId);
        session?.voteCard(playerId, cardId);
        this.io.to(sessionId).emit('session:status', session);
        if (session?.game.playersVoted.length === session?.players.length) {
            if (this.resolver) {
                this.resolver();
                clearTimeout(this.timer);
            }
        }
    }

    getSessionStatus = (sessionId: string) => {
        const session = getSessionById(sessionId);
        this.io.to(sessionId).emit('session:status', session);
    }

    waitTime = async (time:number) => {
        return new Promise((resolve, reject) => {
            this.resolver = resolve;
            this.timer = setTimeout(() => {
                resolve(true);
            }, time * 1000);
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
    sessionNotEmpty = (sessionId: string) => {
        const session = getSessionById(sessionId);
        if (session?.players.length === 0) {
            session.game.round = 100;
            removeSession(sessionId);
        }
    }

    newRound = async (session: Session) => {
        return new Promise(async (resolve) => {
            if (session) {
                session.incrementRound();
                session.provideRoundQuesion();
                session.dealCards();
                this.io.to(session.id).emit('session:status', session);
                session.updateRoundStatus(RoundStatusEnum.picking);
                this.io.to(session.id).emit('session:status', session);
                await this.waitTime(session.settings.roundTime);
                session.pickRandomCardPlayers();
                session.updateRoundStatus(RoundStatusEnum.voting);
                this.io.to(session.id).emit('session:status', session);
                await this.waitTime(session.settings.voteTime);
                console.log('vote end');
                session.voteRandomCardPlayers();
                this.io.to(session.id).emit('session:status', session);
                session.calcRoundScore()
                session.updateRoundStatus(RoundStatusEnum.beforeRound);
                this.io.to(session.id).emit('session:status', session);
                await this.waitTime(session.settings.beforeNextRoundTime);
                session.endRound();
                this.io.to(session.id).emit('session:status', session);
                resolve(true); 
            }
        })
    }
}

import Session from "../models/session.model";
import { getSessionById } from "./dataService";
import { Server } from "socket.io";
import { RoundStatusEnum } from '../enums/roundStatusEnum';
import { addProxySet } from "../utils/proxy";
import Player from "../models/player.model";
export default class GameService {
    io: Server;
    constructor(io: Server) {
        this.io = io;
    }

    playerPickCard = (sessionId: string, cardId: string, playerId: string) => {
        const session = getSessionById(sessionId);
        session?.pickCard(playerId, cardId);
        this.io.to(sessionId).emit('session:status', session);
    }

    playerVoteCard = (sessionId: string, cardId: string, playerId: string) => {
        const session = getSessionById(sessionId);
        session?.voteCard(playerId, cardId);
        this.io.to(sessionId).emit('session:status', session);
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
    waitSecondsOrCardsPick = (session: Session) => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                resolve(true);
            }, session.settings.roundTime * 1000);
            session.game = addProxySet(session.game, () => {
                if (session.game.roundCards.length === session.players.length) {
                    clearTimeout(timeout);
                    resolve(true);
                }        
            }, 'roundCards');
        })   
    }
    waitSecondsOrVote = (session: Session) => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                resolve(true);
            }, session.settings.voteTime * 1000);
            session.game = addProxySet(session.game, () => {
                if (session.game.playersVoted.length === session.players.length) {
                    clearTimeout(timeout);
                    resolve(true);
                }        
            }, 'playersVoted');
        })   
    }
    startSession = async (sessionId: string) => {
        const session = getSessionById(sessionId);
        this.io.to(sessionId).emit('session:started');
        if (session) {
            session.shuffleCards();
            while (session.game.round < session.settings.maxRounds) {
                await this.newRound(session);
            }
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
                await this.waitSecondsOrCardsPick(session);
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

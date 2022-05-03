import Session from "../models/session.model";
import { getSessionById } from "./dataService";
import { Server } from "socket.io";
import { RoundStatusEnum } from '../enums/roundStatusEnum';
import { watchProp } from "../utils/proxy";
export default class GameService {
    io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    playerPickCard = (sessionId: string, cardId: string, playerId: string) => {
        const session = getSessionById(sessionId);
        session?.pickCard(playerId, cardId);
    }

    playerVoteCard = (sessionId: string, cardId: string) => {
        const session = getSessionById(sessionId);
        session?.voteCard(cardId);
    }

    getSessionStatus = (sessionId: string) => {
        const session = getSessionById(sessionId);
        this.io.to(sessionId).emit('session:status', session);
    }

    waitSeconds = async(seconds: number) => {    
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('timedout');
            }, seconds * 1000)
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
                session.updateRoundStatus(RoundStatusEnum.picking);
                await this.waitSeconds(session.settings.roundTime);
                session.updateRoundStatus(RoundStatusEnum.voting);
                await this.waitSeconds(session.settings.voteTime);
                session.calcRoundScore()
                session.updateRoundStatus(RoundStatusEnum.beforeRound);
                console.log('voting end')
                await this.waitSeconds(15);
                session.moveRoundCardsToPlayed();
                resolve(true); 
            }
        })
    }
}

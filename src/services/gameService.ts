import SessionEventEmitter from "../emiters/sessionEventEmiter";
import Session from "../models/session.model";
import { getSessionById } from "./dataService";
import { Server } from "socket.io";
import { RoundStatusEnum } from '../enums/roundStatusEnum';
import { addProxySet, addProxySetNested } from "../utils/proxy";
import { debounce, throttle } from "lodash";

const newRound = async (io: Server, session: Session) => {
    return new Promise(async (resolve) => {
        const emitter = new SessionEventEmitter(io);
        if (session) {
            //session.moveRoundCardsToPlayed();
            session.incrementRound();
            session.provideRoundQuesion();
            session.dealCards();
            session.updateRoundStatus(RoundStatusEnum.picking);
            // emitter.emitSessionUpdate(session);
            console.log(RoundStatusEnum.picking)
            await waitSeconds(session.settings.roundTime);
            console.log(RoundStatusEnum.voting)
            session.updateRoundStatus(RoundStatusEnum.voting);
            // emitter.emitSessionUpdate(session);
            await waitSeconds(session.settings.voteTime);
            session.calcRoundScore()
            session.updateRoundStatus(RoundStatusEnum.beforeRound);
            // emitter.emitSessionUpdate(session);
            await waitSeconds(15);
            session.moveRoundCardsToPlayed();
            // emitter.emitSessionUpdate(session);
            resolve(true); 
        }
    })
}
const waitSeconds = async(seconds: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('timedout');
        }, seconds * 1000)
    })
}
const waitSecondsOrCardsPick = async(seconds: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('timedout');
        }, seconds * 1000)
    })
}

const startSession = async (io: Server, sessionId: string) => {
    const session = getSessionById(sessionId);
    if (session) {
        
        const throttledUpdate = throttle(() => {
            console.log('updating status')
            io.to(session.id).emit('session:status', session);
        }, 100);
        const sessionProxy = addProxySet(session, throttledUpdate);
        sessionProxy.shuffleCards();
        while (sessionProxy.game.round < sessionProxy.settings.maxRounds) {
            await newRound(io, sessionProxy);
        }
    }
}

export default startSession;
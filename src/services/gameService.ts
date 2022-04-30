import SessionEventEmitter from "../emiters/sessionEventEmiter";
import Session from "../models/session.model";
import { getSessionById } from "./dataService";
import { Server } from "socket.io";
const startSession = (io: Server, sessionId: string) => {
    const session = getSessionById(sessionId);
    const emitter = new SessionEventEmitter(io);
    if (session) {
        session.shuffleCards();
        session.dealCards();
        session.incrementRound();
        session.provideRoundQuesion();
        setInterval(() => {
            emitter.emitSessionUpdate(session);
        }, 1000) 
    }
}

export default startSession;
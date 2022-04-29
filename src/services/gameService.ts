import Session from "../models/session.model";
import { getSessionById } from "./dataService";

const startSession = (sessionId: string) => {
    const session = getSessionById(sessionId);
    console.log(session);
    //shuffle cards
    if (session) {
        session.dealCards();
        session.incrementRound();
        session.provideRoundQuesion();
    }
}

export default startSession;
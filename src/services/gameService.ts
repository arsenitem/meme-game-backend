import Session from "../models/session.model";

const startSession = (session: Session) => {
    //shuffle cards
    session.dealCards();
    session.incrementRound();
    session.provideRoundQuesion();

}
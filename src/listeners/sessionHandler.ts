import Session from "../models/session.model";
import {addSession, getPlayerById, addPlayerToSession, getSessionById, getActiveSession} from '../services/dataService';
import Game from "../models/game.model";
import Settings from "../models/settings.model";
import startSession from "../services/gameService";
import { Server } from "socket.io";
import { addProxySet } from "../utils/proxy";
export default (io: Server, socket: any) => {
    const createSession = ({name}: {name: string}) => {
        const host = getPlayerById(socket.id)
        if (host) {
            const game = new Game();
            const settings = new Settings();
            const session = new Session(name, host, settings, game);
            addSession(session);
            addPlayerToSession(socket.id, session.id);
            socket.join(session.id);
            socket.emit("session:created", session);
            socket.broadcast.emit("session:list", getActiveSession());
        }
    }

    const getSessionList = () => {
        socket.emit("session:list", getActiveSession());
    }

    const sessionStart = ({sessionId}: {sessionId: string}) => {
        startSession(io, sessionId);
        io.to(sessionId).emit('session:started');        
    }

    const getSessionStatus = ({sessionId}: {sessionId: string}) => {
        const session = getSessionById(sessionId);
        io.to(sessionId).emit('session:status', session);
    }

    const sessionPickCard = ({sessionId, cardId}: {sessionId: string, cardId: string}) => {
        const session = getSessionById(sessionId);
        //proxyed session
        session?.pickCard(socket.id, cardId);
        // io.to(sessionId).emit('session:updated', session);
    }

    const sessionVoteCard = ({sessionId, cardId}: {sessionId: string, cardId: string}) => {
        const session = getSessionById(sessionId);
        //proxyed session
        session?.voteCard(cardId);
        // io.to(sessionId).emit('session:updated', session);
    }
    socket.on('session:create', createSession);
    socket.on('session:getList', getSessionList);
    socket.on('session:getStatus', getSessionStatus);

    socket.on('session:start', sessionStart);
    socket.on('session:pickCard', sessionPickCard);
    socket.on('session:voteCard', sessionVoteCard);
}
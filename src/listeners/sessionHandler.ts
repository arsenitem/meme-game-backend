import Session from "../models/session.model";
import {addSession, getPlayerById, addPlayerToSession, getSessionById, getActiveSession} from '../services/dataService';
import Game from "../models/game.model";
import Settings from "../models/settings.model";
import GameService from "../services/gameService";
import { Server } from "socket.io";
import { addProxySet } from "../utils/proxy";
import { throttle } from "lodash";
export default (io: Server, socket: any) => {
    const gameService = new GameService(io);
    const createSession = ({name}: {name: string}) => {
        const host = getPlayerById(socket.id)
        if (host) {
            const game = new Game();
            const settings = new Settings();
            const session = new Session(name, host, settings, game);
            const throttledUpdate = throttle(() => {
                io.to(session.id).emit('session:status', session);
            }, 100);
            const sessionProxy = addProxySet(session, throttledUpdate);
            addSession(sessionProxy);
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
        gameService.startSession(sessionId);      
    }

    const getSessionStatus = ({sessionId}: {sessionId: string}) => {
        gameService.getSessionStatus(sessionId);
    }

    const sessionPickCard = ({sessionId, cardId}: {sessionId: string, cardId: string}) => {
        gameService.playerPickCard(sessionId, cardId, socket.id);
    }

    const sessionVoteCard = ({sessionId, cardId}: {sessionId: string, cardId: string}) => {
        gameService.playerVoteCard(sessionId, cardId);
    }
    socket.on('session:create', createSession);
    socket.on('session:getList', getSessionList);
    socket.on('session:getStatus', getSessionStatus);

    socket.on('session:start', sessionStart);
    socket.on('session:pickCard', sessionPickCard);
    socket.on('session:voteCard', sessionVoteCard);
}
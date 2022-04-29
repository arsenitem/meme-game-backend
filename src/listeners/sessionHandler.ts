import Session from "../models/session.model";
import {addSession, getPlayerById, addPlayerToSession, getSessionById, getActiveSession} from '../services/dataService';
import Game from "../models/game.model";
import Settings from "../models/settings.model";
import startSession from "../services/gameService";
export default (io: any, socket: any) => {
    const createSession = ({name}: {name: string}) => {
        const host = getPlayerById(socket.id)
        if (host) {
            const game = new Game();
            const settings = new Settings();
            const session = new Session(name, host, settings, game);
            addSession(session);
            addPlayerToSession(socket.id, session.id);
            socket.emit("session:created", session);
            console.log('created session, updating list')
            console.log(getActiveSession());
            socket.broadcast.emit("session:list", getActiveSession());
            console.log('sended session:list')
        }
    }

    const getSessionList = () => {
        socket.emit("session:list", getActiveSession());
    }

    const sessionStart = ({sessionId}: {sessionId: string}) => {
        startSession(sessionId);
        socket.emit("session:list", getActiveSession());
    }

    const getSessionStatus = ({sessionId}: {sessionId: string}) => {
        const session = getSessionById(sessionId);
        session?.players.forEach((player) => {
            const playerSocket = io.sockets.sockets.get(player.id);
            if (playerSocket) {
                playerSocket.emit("session:status", session);
            }
        });
    }
    socket.on('session:create', createSession);
    socket.on('session:getList', getSessionList);
    socket.on('session:getStatus', getSessionStatus);

    socket.on('session:start', sessionStart);
}
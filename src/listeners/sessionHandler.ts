import Session from "../models/session.model";
import data from './../data/index';
import {addSession, getPlayerById, addPlayerToSession, getSessionById} from '../services/dataService';
export default (io: any, socket: any) => {
    const createSession = ({name}: {name: string}) => {
        const host = getPlayerById(socket.id)
        if (host) {
            const session = new Session(name, host);
            addSession(session);
            addPlayerToSession(socket.id, session.id);
            socket.emit("session:created", session);
        }
    }

    const getSessionList = () => {
        setInterval(() => {
            socket.emit("session:list", data.activeSessions);
        }, 1000);
    }

    const sessionStart = ({sessionId}: {sessionId: string}) => {
        const session = getSessionById(sessionId);
        setInterval(() => {
            session?.players.forEach((player) => {
                io.sockets.sockets.get(player.id).emit("session:status", session);
            });
        }, 1000);
    }
    socket.on('session:create', createSession);
    socket.on('session:getList', getSessionList);

    socket.on('session:start', sessionStart);
}
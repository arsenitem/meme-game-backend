import Player from "../models/player.model"
import { addPlayer, addPlayerToSession,removePlayerFromSession, removePlayerById, getSessionById, getPlayerById } from "../services/dataService";
export default (io: any, socket: any) => {
    const createPlayer = async ({name}: {name: string}) => {
        const player = new Player(name, socket.id as string);
        addPlayer(player);
        socket.emit('player:created', player);
    }
    const joinSession = async ({sessionId} : {sessionId: string}) => { 
        const player = getPlayerById(socket.id) 
        if (typeof player?.currentSessionId !== "undefined") {
            removePlayerFromSession(socket.id, player.currentSessionId);
        }
        addPlayerToSession(socket.id, sessionId);
        socket.join(sessionId);
    }
    const leaveSession = async ({sessionId} : {sessionId: string}) => {
        removePlayerFromSession(socket.id, sessionId);
        socket.leave(sessionId);
    }

    const disconnectPlayer = async () => {
        console.log(socket.id, 'disconnected');
        removePlayerById(socket.id);
    }

    const disconnectSession = async ({sessionId}: {sessionId: string}) => {
        removePlayerFromSession(socket.id, sessionId);
    }

    socket.on('player:create', createPlayer);
    socket.on('player:join', joinSession);
    socket.on('player:leave', leaveSession);
    socket.on('player:disconnect', disconnectSession);

    socket.on('disconnect', disconnectPlayer)
}
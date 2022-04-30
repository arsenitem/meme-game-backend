import Player from "../models/player.model"
import { addPlayer, addPlayerToSession,removePlayerFromSession, removePlayerById, getSessionById } from "../services/dataService";
export default (io: any, socket: any) => {
    const createPlayer = ({name}: {name: string}) => {
        const player = new Player(name, socket.id as string);
        addPlayer(player);
        socket.emit('player:created', player);
    }
    const joinSession = ({sessionId} : {sessionId: string}) => { 
        addPlayerToSession(socket.id, sessionId);
        socket.join(sessionId);
    }
    const leaveSession = ({sessionId} : {sessionId: string}) => {
        removePlayerFromSession(socket.id, sessionId);
        socket.leave(sessionId);
    }

    const disconnectPlayer = () => {
        console.log(socket.id, 'disconnected');
        removePlayerById(socket.id);
    }

    const disconnectSession = ({sessionId}: {sessionId: string}) => {
        removePlayerFromSession(socket.id, sessionId);
    }

    socket.on('player:create', createPlayer);
    socket.on('player:join', joinSession);
    socket.on('player:leave', leaveSession);
    socket.on('player:disconnect', disconnectSession);

    socket.on('disconnect', disconnectPlayer)
}
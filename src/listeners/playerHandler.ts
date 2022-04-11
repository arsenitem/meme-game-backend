import Player from "../models/player.model"
import { addPlayer, addPlayerToSession,removePlayerFromSession, removePlayerById, getSessionById } from "../services/dataService";
export default (io: any, socket: any) => {
    const createPlayer = ({name}: {name: string}) => {
        const player = new Player(name, socket.id as string);
        addPlayer(player);
        socket.emit('player:created', player);
    }
    const joinSession = ({sessionId, playerId} : {sessionId: string, playerId: string}) => { 
        addPlayerToSession(sessionId, playerId);
        const session = getSessionById(sessionId);
        setInterval(() => {
            socket.emit("session:status", session);
        }, 1000);
    }

    const disconnectPlayer = () => {
        removePlayerById(socket.id);
    }

    const disconnectSession = ({sessionId}: {sessionId: string}) => {
        removePlayerFromSession(socket.id, sessionId);
    }

    socket.on('player:create', createPlayer);
    socket.on('player:join', joinSession);
    socket.on('player:disconnect', disconnectSession);

    socket.on('disconnect', disconnectPlayer)
}
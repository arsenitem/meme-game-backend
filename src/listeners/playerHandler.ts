import Player from "../models/player.model"
import { addPlayer, addPlayerToSession,removePlayerFromSession, removePlayerById, getSessionById, getPlayerSessionId } from "../services/dataService";
import GameService from "../services/gameService";
export default (io: any, socket: any) => {
    const gameService = new GameService(io);
    const createPlayer = async ({name}: {name: string}) => {
        const player = new Player(name, socket.id as string);
        addPlayer(player);
        socket.emit('player:created', player);
    }
    const joinSession = async ({sessionId} : {sessionId: string}) => { 
        addPlayerToSession(socket.id, sessionId);
        socket.join(sessionId);
    }
    const leaveSession = async ({sessionId} : {sessionId: string}) => {
        removePlayerFromSession(socket.id, sessionId);
        socket.leave(sessionId);
        gameService.sessionNotEmpty(sessionId);
    }

    const disconnectPlayer = async () => {
        console.log(socket.id, 'disconnected');
        const sessionId = getPlayerSessionId(socket.id);
        removePlayerById(socket.id);
        if (sessionId) {
            gameService.sessionNotEmpty(sessionId);
        }
    }

    socket.on('player:create', createPlayer);
    socket.on('player:join', joinSession);
    socket.on('player:leave', leaveSession);

    socket.on('disconnect', disconnectPlayer)
}
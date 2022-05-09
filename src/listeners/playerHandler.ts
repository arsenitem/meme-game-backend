import Player from "../models/player.model"
import { addPlayer, addPlayerToSession,removePlayerFromSession, removePlayerById, getPlayerSessionId } from "../services/dataService";
import GameService from "../services/gameService";
import logger from "../utils/logger";
export default (io: any, socket: any) => {
    const gameService = new GameService(io);
    const createPlayer = async ({name}: {name: string}) => {
        const player = new Player(name, socket.id as string);
        addPlayer(player);
        socket.emit('player:created', player);
        logger.info(`Created player with id ${socket.id}`);
    }
    const joinSession = async ({sessionId} : {sessionId: string}) => { 
        addPlayerToSession(socket.id, sessionId);
        socket.join(sessionId);
        logger.info(`Player ${socket.id} has joined session ${sessionId}`);
    }
    const leaveSession = async ({sessionId} : {sessionId: string}) => {
        removePlayerFromSession(socket.id, sessionId);
        socket.leave(sessionId);
        gameService.sessionNotEmpty(sessionId);
        logger.info(`Player ${socket.id} has left session ${sessionId}`);
    }

    const disconnectPlayer = async () => {
        const sessionId = getPlayerSessionId(socket.id);
        removePlayerById(socket.id);
        if (sessionId) {
            gameService.sessionNotEmpty(sessionId);
        }
        logger.info(`Player ${socket.id} disconnected`);
    }

    socket.on('player:create', createPlayer);
    socket.on('player:join', joinSession);
    socket.on('player:leave', leaveSession);

    socket.on('disconnect', disconnectPlayer)
}
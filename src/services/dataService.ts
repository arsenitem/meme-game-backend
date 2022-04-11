import Player from "../models/player.model";
import Session from "../models/session.model";
import data from './../data/index';

const getSessionById = (id: string) => {
    return data.activeSessions.find((session) => session.id === id);
}

const addSession = (session: Session) => {
    data.activeSessions.push(session);
}
const addPlayer = (player: Player) => {
    data.activePlayers.push(player);
}
const addPlayerToSession = (playerId: string, sessionId: string) => {
    const player = getPlayerById(playerId);
    const session = getSessionById(sessionId);
    if (player && session) {
        session.addPlayer(player);
        player.updateSessionId(session.id);
    }
}
const removePlayerFromSession = (playerId: string, sessionId: string) => {
    const player = getPlayerById(playerId);
    const session = getSessionById(sessionId);
    if (player && session) {
        session.removePlayer(player);
        player.updateSessionId('');
    }
}
const getPlayerById = (id: string) => {
    return data.activePlayers.find((player) => player.id === id);
}
const removePlayerById = (playerId: string) => {
    const player = getPlayerById(playerId);
    data.activePlayers = data.activePlayers.filter((player) => player.id !== playerId);
    if (player?.currentSessionId) {
        removePlayerFromSession(playerId, player.currentSessionId);
    }
}
export {
    getSessionById,
    addSession,
    addPlayer,
    addPlayerToSession,
    removePlayerFromSession,
    getPlayerById,
    removePlayerById
}
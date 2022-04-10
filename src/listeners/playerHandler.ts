import Player from "../models/player.model"
import { activePlayers, activeSessions } from './../data/index';
export default (io: any, socket: any) => {
    const createPlayer = ({name}: {name: string}) => {
        const player = new Player(name);
        activePlayers.push(player);
        socket.emit('player:created', player);
        console.log(activePlayers);
    }
    const joinSession = ({sessionId, playerId} : {sessionId: string, playerId: string}) => {
        const session = activeSessions.find((session) => session.id === sessionId);
        const player = activePlayers.find((player) => player.id === playerId);
        if (session && player) {
            session.addPlayer(player);
        }
        console.log(activeSessions);
        setInterval(() => {
            socket.emit("session:status", session);
        }, 1000);
    }

    socket.on('player:create', createPlayer);
    socket.on('player:join', joinSession)
}
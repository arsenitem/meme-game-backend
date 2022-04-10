import Session from "../models/session.model";
import Player from "../models/player.model";
import { activeSessions, activePlayers } from './../data/index';
export default (io: any, socket: any) => {
    const createSession = ({name, hostId, maxPlayers}: {name: string, hostId: string, maxPlayers: number}) => {
        const host =  activePlayers.find((player) => player.id === hostId);
        if (host) {
            const session = new Session(name, host, maxPlayers);
            activeSessions.push(session);
            console.log(activeSessions);
        }
    }

    const getSessionList = () => {
        setInterval(() => {
            socket.emit("session:list", activeSessions);
        }, 1000);
    }
    socket.on('session:create', createSession);
    socket.on('session:getList', getSessionList);
}
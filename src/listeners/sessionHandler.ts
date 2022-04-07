import Session from "../models/session.model"
import Player from "../models/player.model"
export default (io: any, socket: any) => {
    const createSession = (name: string, host: Player, maxPlayers: number) => {
        const session = new Session(name, host, maxPlayers);
    }

    socket.on('session:create', createSession)
}
import { Server } from "socket.io";
import Session from "../models/session.model";

export default class SessionEventEmitter {
    io: Server;
    constructor(io: Server) {
        this.io = io;
    }

    emitSessionUpdate(session: Session) {
        this.io.to(session.id).emit('session:updated', session);
    }
}

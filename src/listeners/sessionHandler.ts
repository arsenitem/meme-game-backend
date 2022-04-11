import Session from "../models/session.model";
import data from './../data/index';
import {addSession, getPlayerById} from '../services/dataService';
export default (io: any, socket: any) => {
    const createSession = ({name}: {name: string}) => {
        const host = getPlayerById(socket.id)
        if (host) {
            const session = new Session(name, host);
            addSession(session);
        }
    }

    const getSessionList = () => {
        setInterval(() => {
            socket.emit("session:list", data.activeSessions);
        }, 1000);
    }
    socket.on('session:create', createSession);
    socket.on('session:getList', getSessionList);
}
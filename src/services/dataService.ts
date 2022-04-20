import Player from "../models/player.model";
import Session from "../models/session.model";
import data from './../data/index';
import fs from "fs"
import Meme from "../models/meme.model";

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
const getQuestions = () => {
    try {
        const questions = fs.readFileSync('./src/data/questions.txt', 'utf8');
        return questions.split('\n');
    } catch(err) {
        console.log(err);
        return [];
    };
}
const getMemes = () => {
    return data.cards;
}
const setupMemes = () => {
    try {
        const memesFolder = './src/data/memes';
        const files = fs.readdirSync(memesFolder);
        files.forEach((file) => {
            fs.readFile(memesFolder+ '/' + file, (err, dataBlob) => {
               const meme = new Meme(dataBlob);
               data.cards.push(meme)
            });
        });
    } catch(err) {
        console.log(err);
        return [];
    }
} 
export {
    getSessionById,
    addSession,
    addPlayer,
    addPlayerToSession,
    removePlayerFromSession,
    getPlayerById,
    removePlayerById,
    getQuestions,
    setupMemes,
    getMemes,
}
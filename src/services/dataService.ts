import Player from "../models/player.model";
import Session from "../models/session.model";
import data from './../data/index';
import fs from "fs"
import Meme from "../models/meme.model";
import 'dotenv/config';
import axios, { AxiosError, AxiosResponse } from "axios";
import Question from "../models/question.model";

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
    if (player?.currentSessionId) {
        removePlayerFromSession(playerId, player.currentSessionId);
    }
    data.activePlayers = data.activePlayers.filter((player) => player.id !== playerId);
}
const getQuestions = () => {
    return data.questions;
}
const getMemes = () => {
    return data.cards;
}
const setupData = () => {
    axios.get(`${process.env.FILE_SERVICE_URL}/file/list?links=true`).then((response: AxiosResponse) => {
        response.data.forEach((memeItem: {id: string, link: string}) => {
            const meme = new Meme(memeItem.id, memeItem.link)
            data.cards.push(meme);
        });
    }).catch((err: AxiosError) => {
        console.log(err.message);
    })

    try {
        const questions = fs.readFileSync('./src/data/questions.txt', 'utf8');
        const questionsArray = questions.split('\n');
        questionsArray.forEach((questionText: string) => {
            const question = new Question(undefined, questionText);
            data.questions.push(question);
        })
    } catch(err) {
        console.log(err);
    };
} 

const getActiveSession = () => {
    return data.activeSessions;
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
    setupData,
    getMemes,
    getActiveSession,
}
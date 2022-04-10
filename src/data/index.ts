import Player from './../models/player.model';
import Session from './../models/session.model';

const activeSessions: Array<Session> = [];
const activePlayers: Array<Player> = [];

export {activePlayers, activeSessions};
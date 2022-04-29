
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import registerSessionHandler from './listeners/sessionHandler';
import registerPlayerHanlder from './listeners/playerHandler';
import { setupData } from './services/dataService';
import 'dotenv/config';

setupData();

const app = express();

app.use(cors({origin: "*"}));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

server.listen(process.env.PORT, () => {
    console.log(`App started at port ${process.env.PORT}`);
});

const onConnection = (socket: Socket) => {
    console.log("Established connection with", socket.id);
    registerSessionHandler(io, socket);
    registerPlayerHanlder(io, socket);
}

io.on('connection', onConnection);
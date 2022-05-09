
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import registerSessionHandler from './listeners/sessionHandler';
import registerPlayerHanlder from './listeners/playerHandler';
import { setupData } from './services/dataService';
import 'dotenv/config';
import logger from './utils/logger';

setupData();

const app = express();

app.use(cors({origin: "*"}));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

server.listen(process.env.PORT, () => {
    logger.info(`App started at port ${process.env.PORT}`);
});

const onConnection = (socket: Socket) => {
    logger.info(`Established connection with ${socket.id}`);
    registerSessionHandler(io, socket);
    registerPlayerHanlder(io, socket);
}

io.on('connection', onConnection);

process
.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection at Promise: '+ reason);
})
.on('uncaughtException', err => {
    logger.error('Uncaught Exception thrown: ' +err);
    process.exit(1);
});
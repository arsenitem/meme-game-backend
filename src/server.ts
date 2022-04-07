
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import registerSessionHandler from './listeners/sessionHandler';

const app = express();
app.use(cors({origin: "*"}));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } })
const port = 3000;

server.listen(port, () => {
    console.log(`App started at port ${port}`)
});

const onConnection = (socket: Socket) => {
    registerSessionHandler(io, socket);
}

io.on('connection', onConnection);
// io.on('connection', (socket) => {
//     console.log(socket.id);

//     socket.on('join', (data) => {
//         console.log(data.sessionId);
//         console.log(data.userId);

//         socket.emit('sessions', [1,2,3]);
//     })
// })
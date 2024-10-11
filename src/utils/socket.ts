import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const createSocketServer = (httpServer: HttpServer) => {    
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });
    });

    io.on('Join room', (socket) => {
        socket.join();
    });

    return io;
};

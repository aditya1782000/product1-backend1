import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { socketMiddleware } from '../sockets/middleware';
import { UserSocket } from '../types/socket';

declare global {
    var io: Server;
}

export const createSocketServer = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        },
    });

    global.io = io;

    socketMiddleware(io);

    io.on('connection', (socket: UserSocket) => {
        const user = socket.user;

        if (user?.role === 'superAdmin') {
            user.organization.forEach((organisation) => {
                socket.join(organisation.toString());
                console.log(
                    'Super admin joined room for organization',
                    organisation,
                );
            });
        } else if (user?.role === 'subAdmin') {
            const hasOrderAccess = user.permissions.some(
                (permission) => permission.eKey === 'order',
            );

            if (hasOrderAccess) {
                user.organization.forEach((organisation) => {
                    socket.join(organisation.toString());
                    console.log(
                        'Sub admin joined room for organization',
                        organisation,
                    );
                });
            }
        } else if (user?.role === 'customer') {
            socket.join(user.id);
            console.log('User has joined the room', user.id);
        }

        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });
    });

    io.on('Join room', (socket) => {
        socket.join();
    });

    return io;
};

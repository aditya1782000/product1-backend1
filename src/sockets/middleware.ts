/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { UserSocket } from '../types/socket';

export const socketMiddleware = (io: Server) => {
    io.use(async (socket: Socket & UserSocket, next) => {
        try {
            let token = socket.handshake.headers.authorization;

            if (!token) {
                return next(new Error('Authentication erro: Token required'));
            }

            token = token.replace('Bearer', '');
            let decoded: any;

            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    socket.disconnect(true);
                }
            }

            const oUser = await User.findById(decoded.id).select(
                'organization isActive role permissions',
            );

            if (!oUser) {
                return next(new Error('Authentication error: User not found'));
            }

            if (!oUser.isActive) {
                return next(
                    new Error('Authentication error: User is inactive'),
                );
            }

            socket.user = {
                id: oUser.id.toString(),
                role: oUser.role,
                permissions: oUser.permissions.map((p) => ({
                    eKey: p.eKey,
                    eType: p.eType,
                })),
                organization: oUser.organization,
            };

            next();
        } catch (error: unknown) {
            if (error instanceof Error) {
                socket.disconnect(true);
            }
        }
    });
};

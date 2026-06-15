import mongoose from 'mongoose';
import { Socket } from 'socket.io';

export interface UserSocket extends Socket {
    user?: {
        id: string;
        role: string;
        permissions: {
            eKey: string;
            eType: string[];
        }[];
        organization: mongoose.Types.ObjectId[];
    };
}

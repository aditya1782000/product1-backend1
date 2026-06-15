/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { validationResult } from 'express-validator';

interface RequestWithUser extends Request {
    userId?: string;
    sEmail?: string;
    sOrganization?: string;
}

export const validateOnlyAdmin = (bSuper: boolean = false) => {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            let token = req.headers.authorization;

            if (!token) {
                return res.status(403).json({
                    success: false,
                    message: 'Token is required',
                });
            }

            token = token.replace('Bearer ', '');
            let decoded: any;

            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    return res.status(401).json({
                        success: false,
                        message: error.message || 'Token is expired or invalid',
                    });
                }
            }

            const oUser = await User.findOne({
                _id: decoded.id,
                isDeleted: { $ne: true },
            });

            if (!oUser) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized access',
                });
            }

            (req as any).userId = oUser._id;
            req.sEmail = oUser.email;
            (req as any).sOrganization = oUser.organization;

            if (bSuper) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized access',
                });
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            return next();
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({
                    success: false,
                    message: error.message || 'Something went wrong',
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Something went wrong',
            });
        }
    };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user';
import { ValidationError, validationResult } from 'express-validator';

interface RequestWithUser extends Request {
    userId?: string;
    sEmail?: string;
    pinCode?: number;
    sOrganization?: mongoose.Types.ObjectId[];
    sOrgnaizationName?: string;
}

export const isCustomer = () => {
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
            }).select(
                'organization role isActive pinCode orgnaizationName type',
            );

            if (!oUser) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized access',
                });
            }

            if (!oUser.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'User is inactive',
                });
            }

            if (oUser.role !== 'customer') {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized access',
                });
            }

            (req as any).userId = oUser._id;
            req.sEmail = oUser.email;
            (req as any).sOrganization = oUser.organization;
            (req as any).pinCode = oUser.pinCode;
            (req as any).type = oUser.type;
            (req as any).sOrgnaizationName = oUser.orgnaizationName;
            (req as any).role = oUser.role;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors
                    .array()
                    .map((error: ValidationError) => error.msg)
                    .join(', ');
                return res.status(422).json({
                    success: false,
                    message: errorMessages,
                });
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

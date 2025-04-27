/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { ValidationError, validationResult } from 'express-validator';
import mongoose from 'mongoose';

interface RequestWithUser extends Request {
    userId?: string;
    sEmail?: string;
    sOrganization?: mongoose.Types.ObjectId[];
}

export const isAdmin = (
    eKey: string | null = null,
    eType: string | null = null,
) => {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            let token = req.headers.authorization;

            const role = req.body.role || req.query.role || req.params.role;

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
            }).select('organization isActive');

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

            (req as any).userId = oUser._id;
            req.sEmail = oUser.email;
            (req as any).sOrganization = oUser.organization;

            if (oUser.role === 'superAdmin') {
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
            }

            if (role === 'subAdmin') {
                const aPermissions = oUser.permissions || [];

                const hasPermissions = aPermissions.filter(
                    (Permissions: any) => {
                        return (
                            Permissions.eKey === eKey &&
                            Permissions.eType.includes(eType)
                        );
                    },
                );

                if (!hasPermissions) {
                    return res.status(403).json({
                        success: false,
                        message: 'Permission access',
                    });
                }

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
            }

            if (role === 'employee') {
                if (eKey === 'attendance') {
                    if (req.body.userId === decoded.id) {
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
                    } else {
                        return res.status(403).json({
                            success: false,
                            message: 'Unauthorized access',
                        });
                    }
                }
            }

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

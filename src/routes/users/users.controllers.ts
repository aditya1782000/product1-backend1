import { Request, Response } from 'express';
import { addUsers } from './user.services';
import mongoose from 'mongoose';

interface RequestWithUser extends Request {
    sOrganization?: mongoose.Types.ObjectId[];
}

export const addUsersControlller = async (
    req: RequestWithUser,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        permissions,
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
    } = req.body;

    const oResponse = await addUsers(
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        permissions,
        organization,
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

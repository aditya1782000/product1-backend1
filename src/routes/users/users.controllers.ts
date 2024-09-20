import { Request, Response } from 'express';
import { addUsers, usersList } from './user.services';
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

export const usersListControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);
    const { role } = req.body;

    const oResponse = await usersList(req, offSet, limit, role, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

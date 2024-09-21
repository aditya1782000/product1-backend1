import { Request, Response } from 'express';
import {
    addUsers,
    usersList,
    userToggleStatus,
    userView,
} from './user.services';
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

export const userViewController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await userView(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const userToggleStatusController = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await userToggleStatus(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

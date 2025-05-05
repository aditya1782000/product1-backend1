import { Request, Response } from 'express';
import {
    addUsers,
    editUserProfile,
    setProfilePic,
    userDelete,
    userEdit,
    userPermissions,
    userProfile,
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
        type,
        permissions,
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        orgnaizationName,
        gstNumber,
        isBillingOption,
    } = req.body;

    const oResponse = await addUsers(
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        type,
        permissions,
        organization,
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        orgnaizationName,
        gstNumber,
        isBillingOption,
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

export const userEditController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        type,
        permissions,
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        orgnaizationName,
        gstNumber,
        isBillingOption,
    } = req.body;

    const oResponse = await userEdit(
        id,
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        type,
        permissions,
        organization,
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        orgnaizationName,
        gstNumber,
        isBillingOption,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const userDeleteController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await userDelete(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const userPermissionsController = async (
    _req: Request,
    res: Response,
) => {
    const oResponse = await userPermissions();

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const userProfileController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const oResponse = await userProfile(userId);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const userProfileUpdateController = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const { firstName, lastName, email, phoneNumber } = req.body;

    const oResponse = await editUserProfile(
        userId,
        firstName,
        lastName,
        email,
        phoneNumber,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const setProfilePicControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const oResponse = await setProfilePic(req, userId);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

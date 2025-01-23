import { Request, Response } from 'express';
import {
    addContactUs,
    deleteContactUs,
    listContactUs,
    resolveContactus,
} from './contactus.services';

export const addContactUsControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { name, phoneNumber, email, message } = req.body;

    const oResponse = await addContactUs(
        name,
        phoneNumber,
        email,
        message,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listContactUsControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listContactUs(req, offSet, limit, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const deleteContactUsControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await deleteContactUs(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const resolveContactUscontrollers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await resolveContactus(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

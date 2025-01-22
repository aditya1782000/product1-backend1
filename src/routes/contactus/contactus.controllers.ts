import { Request, Response } from 'express';
import { addContactUs } from './contactus.services';

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

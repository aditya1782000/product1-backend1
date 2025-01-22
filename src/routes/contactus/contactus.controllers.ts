import { Request, Response } from 'express';
import { addContactUs } from './contactus.services';

export const addContactUsControllers = async (req: Request, res: Response) => {
    const { name, phoneNumber, email, message } = req.body;

    const oResponse = await addContactUs(name, phoneNumber, email, message);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

import { Request, Response } from 'express';
import { registerUser } from './registration.services';
import { validationResult } from 'express-validator';

export const registerUserControllers = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        organisationName,
        gstNumber,
        addressLineone,
        addressLineTwo,
        city,
        state,
        pinCode,
        plan,
        place,
    } = req.body;

    const oResponse = await registerUser(
        firstName,
        lastName,
        email,
        phoneNumber,
        organisationName,
        gstNumber,
        addressLineone,
        addressLineTwo,
        city,
        state,
        pinCode,
        plan,
        place,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

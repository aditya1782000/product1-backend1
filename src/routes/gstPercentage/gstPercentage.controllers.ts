import { Request, Response } from 'express';
import {
    createGstPercentage,
    listGstPercentage,
} from './gstPercentage.servcies';

export const createGstPercentageControllers = async (
    req: Request,
    res: Response,
) => {
    const { gstPercentage } = req.body;

    const oResponse = await createGstPercentage(gstPercentage);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listGstPercentageControllers = async (
    _req: Request,
    res: Response,
) => {
    const oResponse = await listGstPercentage();

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

import { Request, Response } from 'express';
import {
    addDeliveryAddress,
    listDeliveryAddress,
} from './deliveryAddress.services';
import { ObjectId } from 'mongodb';

export const addAdminDeliveryAddressControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const { addressLineOne, addressLineTwo, city, state, pinCode } = req.body;

    const oResponse = await addDeliveryAddress(
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        new ObjectId(id),
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listAdminDeliveryAddressControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await listDeliveryAddress(new ObjectId(id), organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const addDeliveryAddressControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = (req as any).userId;

    const { addressLineOne, addressLineTwo, city, state, pinCode } = req.body;

    const oResponse = await addDeliveryAddress(
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        customer,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listDeliveryAddressControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = (req as any).userId;

    const oResponse = await listDeliveryAddress(customer, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

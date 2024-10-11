import { Request, Response } from 'express';
import { createCustomerOrder, recieveCustomerOrders } from './orders.services';

export const createCustomerOrderController = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = (req as any).userId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { orderItems, totalAmount, status, type } = req.body;

    const oResponse = await createCustomerOrder(
        customer,
        orderItems,
        totalAmount,
        status,
        type,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const receiveCustomerOrdersControllers = async (
    _req: Request,
    res: Response,
) => {
    const oResponse = await recieveCustomerOrders();

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

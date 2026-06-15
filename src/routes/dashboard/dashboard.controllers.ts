import { Request, Response } from 'express';
import {
    countData,
    customerOrderConuts,
    customerRecentDeilveredOrder,
    getRecentOrders,
    orderCountsMonthYear,
    orderDeliveryStatusCount,
} from './dashboard.services';

export const getCountDataControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const oResponse = await countData(organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const getRecentOrdersControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await getRecentOrders(req, offSet, limit, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const orderCountsMonthYearControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { year } = req.body;

    const oResponse = await orderCountsMonthYear(year, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const orderStatusCountControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { year } = req.body;

    const oResponse = await orderDeliveryStatusCount(year, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const customerOrdercountsControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = (req as any).userId;

    const { year } = req.body;

    const oResponse = await customerOrderConuts(year, customer, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const customerRecentDeliveredOrdersController = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = (req as any).userId;

    const oResponse = await customerRecentDeilveredOrder(
        customer,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

import { Request, Response } from 'express';
import {
    customerNotificationList,
    markAllAsRead,
    markAsRead,
    sendNotifications,
} from './notification.services';

export const sendNotificationControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;
    const { customers, title, body, type } = req.body;

    const oResponse = await sendNotifications(
        req,
        customers,
        title,
        body,
        type,
        organization,
    );

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const customerNotificationsListControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = (req as any).userId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const offSet = Number(req.query.start);
    const limit = Number(req.query.length);

    const oResponse = await customerNotificationList(
        customer,
        offSet,
        limit,
        organization,
    );

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const markAsReadControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = (req as any).userId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await markAsRead(id, customer, organization);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const markAllAsReadControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customer = (req as any).userId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const oResponse = await markAllAsRead(customer, organization);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

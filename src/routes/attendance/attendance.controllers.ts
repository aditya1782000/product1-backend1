import { Request, Response } from 'express';
import {
    acceptRejectLeaveRequest,
    clockInClockedOut,
    listClockInClockOutTimes,
    listLeaveRequests,
    listSubAdminAttendanceSheet,
    listUserLeaveRequests,
    requestLeave,
} from './attendance.services';

export const clockInClockOutControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const { location } = req.body;

    const oResponse = await clockInClockedOut(userId, location, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listClockInClockOutTimesControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const { month, year } = req.query;

    const oResponse = await listClockInClockOutTimes(
        userId,
        Number(month),
        Number(year),
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listClockInClockOutTimesSuperAdminViewControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const { month, year } = req.query;

    const oResponse = await listClockInClockOutTimes(
        id,
        Number(month),
        Number(year),
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listSubAdminAttendanceSheetControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listSubAdminAttendanceSheet(
        userId,
        req,
        offSet,
        limit,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const requestLeaveControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const { startDate, endDate, leaveType, reason } = req.body;

    const oResponse = await requestLeave(
        userId,
        startDate,
        endDate,
        leaveType,
        reason,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listUserLeaveRequestsControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listUserLeaveRequests(
        userId,
        req,
        offSet,
        limit,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listLeaveRequestsControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listLeaveRequests(
        userId,
        req,
        offSet,
        limit,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const acceptRejectLeaveRequestControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const { id } = req.params;

    const { action, rejectionReason } = req.body;

    const oResponse = await acceptRejectLeaveRequest(
        userId,
        id,
        action,
        organization,
        rejectionReason,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

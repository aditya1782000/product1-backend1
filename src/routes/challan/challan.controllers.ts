import { Request, Response } from 'express';
import {
    createChallan,
    createChallanOrganization,
    deleteChallan,
    deleteChallanOrganization,
    editChallan,
    editChallanOrganization,
    listChallanOrgnaization,
    listChallans,
    viewChallan,
    viewChallanOrganization,
} from './challan.services';

export const createChallanOrganizationControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { mobileNo, footer, note } = req.body;

    const oResponse = await createChallanOrganization(
        req,
        mobileNo,
        organization,
        footer,
        note,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const createChallanControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { customerName, date, address, items, total } = req.body;

    const oResponse = await createChallan(
        customerName,
        date,
        address,
        items,
        total,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const viewChallanOrganizationControlllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const oResponse = await viewChallanOrganization(organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const editChallanOrganizationControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;
    const { mobileNo, footer, note } = req.body;

    const oResponse = await editChallanOrganization(
        req,
        id,
        organization,
        mobileNo,
        footer,
        note,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const deleteChallanOrganizationControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await deleteChallanOrganization(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const viewChallanControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await viewChallan(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const editChallanControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const { customerName, date, address, items, total } = req.body;

    const oResponse = await editChallan(
        id,
        organization,
        customerName,
        date,
        address,
        items,
        total,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const deleteChallanControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await deleteChallan(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listChallansControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listChallans(req, offSet, limit, organization);

    return res.status(oResponse.statusCode).send({
        data: oResponse,
        statusCode: undefined,
    });
};

export const listChallanOrgnaizationControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listChallanOrgnaization(
        req,
        offSet,
        limit,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        data: oResponse,
        statusCode: undefined,
    });
};

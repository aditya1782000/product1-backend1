import { Request, Response } from 'express';
import {
    addStatements,
    listStatementOrganizationNames,
    listStatements,
} from './statement.services';

export const addStatementsControllers = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const oResponse = await addStatements(req, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listStatementsControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { organizationName } = req.body;
    const from = new Date(req.body.from);
    const to = new Date(req.body.to);

    const oResponse = await listStatements(
        organizationName,
        organization,
        from,
        to,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listCustomerStatementsControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organizationName = (req as any).sOrgnaizationName;

    const from = new Date(req.body.from);
    const to = new Date(req.body.to);

    const oResponse = await listStatements(
        organizationName,
        organization,
        from,
        to,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listStatementsOrgnizationNameControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const oResponse = await listStatementOrganizationNames(req, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

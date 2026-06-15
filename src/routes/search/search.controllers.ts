import { Request, Response } from 'express';
import { productSearch } from './search.services';

export const customerProductsSearchControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pinCode = (req as any).pinCode;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const type = (req as any).type;

    const keyword = String(req.query.keyword);
    const offSet = Number(req.query.start);
    const limit = Number(req.query.length);

    const oResponse = await productSearch(
        keyword,
        pinCode,
        offSet,
        limit,
        organization,
        type,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

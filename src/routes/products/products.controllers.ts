import { Request, Response } from 'express';
import {
    addProduct,
    customerProductList,
    customerProductView,
    listProducts,
    productDelete,
    productEdit,
    productToggleStatus,
    productView,
} from './products.services';

export const addProductsController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { productName, description, howToUse, unitType, category } = req.body;

    let price;
    if (typeof req.body.price === 'string') {
        try {
            price = JSON.parse(req.body.price);
        } catch (error: unknown) {
            return res.status(400).send({
                success: false,
                message: error,
            });
        }
    } else {
        price = req.body.price;
    }

    const oResponse = await addProduct(
        req,
        productName,
        description,
        howToUse,
        unitType,
        price,
        category,
        organization,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listProdutsController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listProducts(req, offSet, limit, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const viewProductsController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await productView(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const toggleProductStatus = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await productToggleStatus(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const editProductController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;
    const { productName, description, howToUse, unitType, category } = req.body;

    let price;
    if (typeof req.body.price === 'string') {
        try {
            price = JSON.parse(req.body.price);
        } catch (error: unknown) {
            return res.status(400).send({
                success: false,
                message: error,
            });
        }
    } else {
        price = req.body.price;
    }

    const oResponse = await productEdit(
        id,
        req,
        organization,
        productName,
        description,
        howToUse,
        unitType,
        category,
        price,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const deleteProductController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await productDelete(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const customerProductListController = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pinCode = (req as any).pinCode;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const type = (req as any).type;

    const offSet = Number(req.query.start);
    const limit = Number(req.query.length);

    const oResponse = await customerProductList(
        organization,
        pinCode,
        type,
        offSet,
        limit,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const customerProductViewController = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pinCode = (req as any).pinCode;

    const { id } = req.params;

    const oResponse = await customerProductView(id, organization, pinCode);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

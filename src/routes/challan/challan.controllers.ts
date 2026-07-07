import { Request, Response } from 'express';
import {
    createChallan,
    createChallanOrganization,
    createCustomChallan,
    createCustomChallanOrganization,
    createVtcChallan,
    deleteChallan,
    deleteChallanOrganization,
    deleteCustomChallan,
    deleteCustomChallanOrgnization,
    downloadChallan,
    downloadCustomChallan,
    editChallan,
    editChallanOrganization,
    editCustomChallan,
    editCustomChallanOrganization,
    editVtcChallan,
    listChallanOrgnaization,
    listChallans,
    listCustomChallan,
    listCustomChallanOrg,
    listVtcChallans,
    viewChallan,
    viewChallanOrganization,
    viewCustomChallan,
    viewCustomChallanOrganization,
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

    const {
        customerName,
        date,
        address,
        items,
        total,
        vehicleNo,
        customerMobileNo,
        fraightAndTransport,
        challanType,
    } = req.body;

    const oResponse = await createChallan(
        customerName,
        customerMobileNo,
        date,
        address,
        items,
        total,
        organization,
        vehicleNo,
        fraightAndTransport,
        challanType,
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

    const {
        customerName,
        date,
        address,
        items,
        total,
        customerMobileNo,
        vehicleNo,
        fraightAndTransport,
        challanType,
    } = req.body;

    const oResponse = await editChallan(
        id,
        organization,
        customerName,
        customerMobileNo,
        date,
        address,
        items,
        total,
        vehicleNo,
        fraightAndTransport,
        challanType,
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

export const createCustomChallanOrganizationControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const {
        challanOrg,
        title,
        address,
        gstNo,
        panNo,
        headerContent,
        footerOne,
        footerTwo,
        footerThree,
        footerFour,
        footerFive,
    } = req.body;

    const oResponse = await createCustomChallanOrganization(
        challanOrg,
        title,
        address,
        gstNo,
        panNo,
        headerContent,
        organization,
        footerOne,
        footerTwo,
        footerThree,
        footerFour,
        footerFive,
    );

    return res.status(oResponse.statusCode).send({
        data: oResponse,
        statusCode: undefined,
    });
};

export const createCustomChallanControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const {
        customerName,
        customerMobileNo,
        date,
        address,
        dated,
        items,
        total,
        partyCode,
        nameOfTransport,
        lrNo,
        orderNo,
        vehicleNo,
    } = req.body;

    const oResponse = await createCustomChallan(
        customerName,
        customerMobileNo,
        date,
        address,
        dated,
        items,
        total,
        organization,
        partyCode,
        nameOfTransport,
        lrNo,
        orderNo,
        vehicleNo,
    );

    return res.status(oResponse.statusCode).send({
        data: oResponse,
        statusCode: undefined,
    });
};

export const viewCustomChallanOrganizationControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const oResponse = await viewCustomChallanOrganization(organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const editCustomChallOrganizationControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const {
        challanOrg,
        title,
        address,
        gstNo,
        panNo,
        headerContent,
        footerOne,
        footerTwo,
        footerThree,
        footerFour,
        footerFive,
    } = req.body;

    const oResponse = await editCustomChallanOrganization(
        id,
        organization,
        challanOrg,
        title,
        address,
        gstNo,
        panNo,
        headerContent,
        footerOne,
        footerTwo,
        footerThree,
        footerFour,
        footerFive,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const deleteCustomChallanOrganizationControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await deleteCustomChallanOrgnization(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const viewCustomChallanControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await viewCustomChallan(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const editCustomChallanControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const {
        customerName,
        customerMobileNo,
        date,
        address,
        dated,
        items,
        total,
        partyCode,
        nameOfTransport,
        lrNo,
        orderNo,
        vehicleNo,
    } = req.body;

    const oResponse = await editCustomChallan(
        id,
        customerName,
        customerMobileNo,
        date,
        address,
        dated,
        items,
        total,
        organization,
        partyCode,
        nameOfTransport,
        lrNo,
        orderNo,
        vehicleNo,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const deleteCutomChallanControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const oResponse = await deleteCustomChallan(id, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listCustomChallanOrgControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listCustomChallanOrg(
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

export const listCustomChallanControllers = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listCustomChallan(req, offSet, limit, organization);

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const downloadChallanController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;
    const { id } = req.params;

    const oResponse = await downloadChallan(id, organization);

    if (!oResponse.success) {
        return res.status(oResponse.statusCode).send({
            success: false,
            message: oResponse.message,
        });
    }

    const { buffer, filename } = oResponse.data as { buffer: Buffer; filename: string };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
};

export const downloadCustomChallanController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;
    const { id } = req.params;

    const oResponse = await downloadCustomChallan(id, organization);

    if (!oResponse.success) {
        return res.status(oResponse.statusCode).send({
            success: false,
            message: oResponse.message,
        });
    }

    const { buffer, filename } = oResponse.data as { buffer: Buffer; filename: string };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
};

export const createVtcChallanController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const {
        customerName,
        date,
        address,
        items,
        total,
        vehicleNo,
        customerMobileNo,
        fraightAndTransport,
        challanType,
    } = req.body;

    const oResponse = await createVtcChallan(
        customerName,
        customerMobileNo,
        date,
        address,
        items,
        total,
        organization,
        vehicleNo,
        fraightAndTransport,
        challanType,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const editVtcChallanController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const { id } = req.params;

    const {
        customerName,
        date,
        address,
        items,
        total,
        customerMobileNo,
        vehicleNo,
        fraightAndTransport,
        challanType,
    } = req.body;

    const oResponse = await editVtcChallan(
        id,
        organization,
        customerName,
        customerMobileNo,
        date,
        address,
        items,
        total,
        vehicleNo,
        fraightAndTransport,
        challanType,
    );

    return res.status(oResponse.statusCode).send({
        ...oResponse,
        statusCode: undefined,
    });
};

export const listVtcChallansController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organization = (req as any).sOrganization;

    const offSet = Number(req.body.start);
    const limit = Number(req.body.length);

    const oResponse = await listVtcChallans(req, offSet, limit, organization);

    return res.status(oResponse.statusCode).send({
        data: oResponse,
        statusCode: undefined,
    });
};

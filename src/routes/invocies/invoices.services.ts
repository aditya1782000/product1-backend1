import { Request } from 'express';
import { AsyncResponseType } from '../../types/async';
import mongoose from 'mongoose';
import User from '../../models/user';
import Order from '../../models/orders';
import { uploadFileToS3 } from '../../utils/aws';
import fs from 'fs';

interface Filter {
    status?: string;
    from?: string;
    to?: string;
    firstName?: string[];
}

const deleteTempFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    });
};

const createFilterQuery = (filter: Filter) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (filter.status) {
        query.status = filter.status;
    }

    if (filter.from || filter.to) {
        query.dCreatedAt = {};

        if (filter.from) {
            query.dCreatedAt.$gte = new Date(filter.from);
        }

        if (filter.to) {
            query.dCreatedAt.$lte = new Date(filter.to);
        }
    }

    if (filter.firstName) {
        query.customer = filter.firstName;
    }

    return query;
};

export const listDeliveredOrders = async (
    req: Request,
    start: number,
    limit: number,
    filter: Filter,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const filterQuery = createFilterQuery(filter);

        if (filter.firstName) {
            const firstNames = Array.isArray(filter.firstName)
                ? filter.firstName
                : [filter.firstName];

            const namePatterns = firstNames.map(
                (name) => new RegExp(name, 'i'),
            );

            const matchingCustomers = await User.find(
                {
                    firstName: { $in: namePatterns },
                    role: 'customer',
                    organization: { $in: [organisation] },
                },
                '_id',
            ).lean();

            if (matchingCustomers.length) {
                const customerIds = matchingCustomers.map(
                    (customer) => customer._id,
                );
                filterQuery.customer = { $in: customerIds };
            } else {
                return {
                    statusCode: 404,
                    success: false,
                    message: 'No customers found with the given name',
                };
            }
        }

        const orderQuery = {
            $and: [filterQuery],
            status: 'delivered',
            invoiceUrl: { $exists: false },
            organization: { $in: [organisation] },
        };

        const nRecordsTotal = await Order.countDocuments(orderQuery);

        const orders = await Order.find(orderQuery)
            .populate('customer', '_id firstName lastName phoneNumber')
            .select('totalAmount dCreatedAt status orderNumber')
            .collation({ locale: 'en', strength: 1 })
            .sort({ dCreatedAt: -1 })
            .skip(start)
            .limit(limit)
            .lean();

        if (!orders.length) {
            return {
                statusCode: 404,
                success: false,
                message: 'No pending orders found',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Pending orders retrieved successfully',
            data: orders,
            draw: req.body.draw,
            recordsTotal: nRecordsTotal,
            recordsFiltered: nRecordsTotal,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const addOrderInvoice = async (
    req: Request,
    orderId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    let invoiceFilePath: string | undefined;
    try {
        const oOrder = await Order.findById({
            _id: orderId,
        }).populate('organization', '_id');

        if (!oOrder) {
            return {
                statusCode: 404,
                success: false,
                message: 'Order not found',
            };
        }

        if (
            oOrder.organization &&
            oOrder.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        if (req.file) {
            invoiceFilePath = req.file.path;
            const uploadData = await uploadFileToS3(
                req.file,
                `${Date.now().toString()}`,
                'invoices',
            );
            invoiceFilePath = uploadData.Location;
        }

        await Order.findByIdAndUpdate(
            { _id: orderId },
            { invoiceUrl: invoiceFilePath },
            { new: true },
        )
            .populate('customer', '_id firstName lastName phoneNumber')
            .select('totalAmount dCreatedAt status invoiceUrl')
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Invoice added successfully',
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    } finally {
        if (invoiceFilePath) {
            deleteTempFile(invoiceFilePath);
        }
    }
};

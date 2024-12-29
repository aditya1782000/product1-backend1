import mongoose from 'mongoose';
import Order from '../../models/orders';
import Product from '../../models/product';
import User from '../../models/user';
import { AsyncResponseType } from '../../types/async';
import { Request } from 'express';

export const countData = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const totalCustomers = await User.countDocuments({
            role: 'customer',
            organization: { $in: [organisation] },
        });
        const totalProducts = await Product.countDocuments({
            organization: { $in: [organisation] },
        });
        const totalOrders = await Order.countDocuments({
            status: { $in: ['approved', 'rejected', 'delivered'] },
            organization: { $in: [organisation] },
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Data count retrieved successfully',
            data: {
                totalCustomers,
                totalProducts,
                totalOrders,
            },
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

export const getRecentOrders = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const orderQuery = {
            status: { $in: ['approved', 'rejected', 'delivered'] },
            organization: { $in: [organisation] },
            dCreatedAt: { $gte: startDate },
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

        return {
            statusCode: 200,
            success: true,
            message: 'Recent orders retrieved successfully',
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

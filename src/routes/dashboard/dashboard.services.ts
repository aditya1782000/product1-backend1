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

export const orderCountsMonthYear = async (
    year: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${parseInt(year) + 1}-01-01`);

        const orders = await Order.aggregate([
            {
                $match: {
                    dCreatedAt: {
                        $gte: start,
                        $lt: end,
                    },
                    organization: { $in: organisation },
                },
            },
            {
                $group: {
                    _id: { $month: '$dCreatedAt' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);

        const result = Array.from({ length: 12 }, (_, index) => {
            const monthData = orders.find((order) => order._id === index + 1);

            return {
                month: index + 1,
                orders: monthData?.count || 0,
            };
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Order counts by month and year retrieved successfully',
            data: result,
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

export const orderDeliveryStatusCount = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const curretDate = new Date();

        const [deliveredOrders, approvedOrders, pendingOrders] =
            await Promise.all([
                Order.countDocuments({
                    status: 'delivered',
                    organization: { $in: [organisation] },
                    dCreatedAt: {
                        $gte: new Date(curretDate.getFullYear(), 0, 1),
                    },
                }),
                Order.countDocuments({
                    status: 'approved',
                    organization: { $in: [organisation] },
                    dCreatedAt: {
                        $gte: new Date(curretDate.getFullYear(), 0, 1),
                    },
                }),
                Order.countDocuments({
                    status: 'pending',
                    organization: { $in: [organisation] },
                    dCreatedAt: {
                        $gte: new Date(curretDate.getFullYear(), 0, 1),
                    },
                }),
            ]);

        return {
            statusCode: 200,
            success: true,
            message: 'Order delivery status count retrieved successfully',
            data: {
                deliveredOrders,
                approvedOrders,
                pendingOrders,
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

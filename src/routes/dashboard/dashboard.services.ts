import mongoose from 'mongoose';
import Order from '../../models/orders';
import Product from '../../models/product';
import User from '../../models/user';
import { AsyncResponseType } from '../../types/async';

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

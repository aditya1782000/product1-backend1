import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import { myKafka } from '../../utils/kafka';
import Order from '../../models/orders';
import { Request } from 'express';
import dataTable from '../../utils/dataTable';
import User from '../../models/user';

interface OrderItems {
    product: mongoose.Types.ObjectId;
    quantity: number;
    quantityType: string;
    unitPrice: number;
    totalPrice: number;
}

export const createCustomerOrder = async (
    customer: mongoose.Types.ObjectId,
    orderItems: OrderItems[],
    totalAmount: number,
    status: string,
    type: string = 'customer',
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const order = {
            customer,
            orderItems,
            totalAmount,
            status,
            type,
            organization: organisation,
        };

        const producer = myKafka.producer();
        await producer.connect();

        await producer.send({
            topic: process.env.TOPIC_ONE || '',
            messages: [
                {
                    value: JSON.stringify(order),
                    key: order.organization.toString(),
                },
            ],
        });

        await producer.disconnect();

        return {
            statusCode: 200,
            success: true,
            message: 'Order created successfully',
            data: order,
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

export const recieveCustomerOrders = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const consumer = myKafka.consumer({
            groupId: `${process.env.GROUP_ID || 'order'}-${organisation}`,
            sessionTimeout: 30000,
            heartbeatInterval: 3000,
        });
        await consumer.connect();

        await consumer.subscribe({
            topic: process.env.TOPIC_ONE || '',
            fromBeginning: true,
        });

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const orderData = JSON.parse(`${message.value}` || '');

                    if (
                        orderData.organization.toString() ===
                        organisation.toString()
                    ) {
                        const newOrder = new Order(orderData);
                        await newOrder.save();
                    }
                } catch (error) {
                    console.error(error);
                }
            },
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Orders received successfully',
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

export const listPendingOrders = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const customerSearchFields = ['firstName', 'lastName'];

        const customerNumberFields = ['phoneNumber'];

        const orderSearchFields = ['status'];

        const orderNumberFields = ['totalAmount'];

        const oCustomerData = dataTable.initDataTable(
            req.body,
            customerSearchFields,
            'srNo',
            customerNumberFields,
        );

        const oOrderData = dataTable.initDataTable(
            req.body,
            orderSearchFields,
            'srNo',
            orderNumberFields,
        );

        const orderQuery = {
            ...oOrderData.oSearchData,
            status: 'inApproval',
            organization: { $in: [organisation] },
            customer: {
                $in: await User.find(oCustomerData.oSearchData).select('_id'),
            },
        };

        const nRecordsTotal = await Order.countDocuments(orderQuery);

        const orders = await Order.find(orderQuery)
            .populate('customer', '_id firstName lastName phoneNumber')
            .select('totalAmount dCreatedAt status')
            .collation({ locale: 'en', strength: 1 })
            .sort(oOrderData.oSortingOrder)
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

export const listCompletedOrders = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const customerSearchFields = ['firstName', 'lastName'];

        const customerNumberFields = ['phoneNumber'];

        const orderSearchFields = ['status'];

        const orderNumberFields = ['totalAmount'];

        const oCustomerData = dataTable.initDataTable(
            req.body,
            customerSearchFields,
            'srNo',
            customerNumberFields,
        );

        const oOrderData = dataTable.initDataTable(
            req.body,
            orderSearchFields,
            'srNo',
            orderNumberFields,
        );

        const orderQuery = {
            ...oOrderData.oSearchData,
            status: { $in: ['approved', 'rejected', 'delivered'] },
            organization: { $in: [organisation] },
            customer: {
                $in: await User.find(oCustomerData.oSearchData).select('_id'),
            },
        };

        const nRecordsTotal = await Order.countDocuments(orderQuery);

        const orders = await Order.find(orderQuery)
            .populate('customer', '_id firstName lastName phoneNumber')
            .select('totalAmount dCreatedAt dUpdatedAt status')
            .collation({ locale: 'en', strength: 1 })
            .sort(oOrderData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        if (!orders.length) {
            return {
                statusCode: 404,
                success: false,
                message: 'No completed orders found',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Completed orders retrieved successfully',
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

export const listCustomerPendingOrders = async (
    customer: mongoose.Types.ObjectId,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const orders = await Order.find({
            customer: { $in: customer },
            status: 'inApproval',
            organization: { $in: organisation },
        })
            .select('status totalAmount dCreatedAt dUpdatedAt deliveredAt')
            .sort({ dCreatedAt: -1 })
            .lean();

        if (!orders.length) {
            return {
                statusCode: 404,
                success: false,
                message: 'No pending orders found for this customer',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Customer pending orders retrieved successfully',
            data: orders,
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

export const listCustomerCompletedOrders = async (
    customer: mongoose.Types.ObjectId,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const orders = await Order.find({
            customer: { $in: customer },
            status: { $in: ['approved', 'rejected', 'delivered'] },
            organization: { $in: organisation },
        })
            .select('status totalAmount dCreatedAt dUpdatedAt deliveredAt')
            .sort({ dCreatedAt: -1 })
            .lean();

        if (!orders.length) {
            return {
                statusCode: 404,
                success: false,
                message: 'No Completed orders found for this customer',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Customer Completed orders retrieved successfully',
            data: orders,
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

export const viewAdminOrder = async (
    orderId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const oOrder = await Order.findById({
            _id: orderId,
        })
            .populate('organization', ' _id')
            .populate(
                'customer',
                '_id firstName lastName phoneNumber addressLineOne addressLineTwo city state pinCode',
            )
            .populate('orderItems.product', 'productName productImageUrl')
            .select(
                'orderItems totalAmount status type deliveredAt dCreatedAt dUpdatedAt',
            )
            .lean();

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

        return {
            statusCode: 200,
            success: true,
            message: 'Order retrieved successfully',
            data: oOrder,
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

export const viewCustomerOrder = async (
    orderId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const oOrder = await Order.findById({
            _id: orderId,
        })
            .populate('organization', '_id')
            .populate(
                'customer',
                '_id firstName lastName phoneNumber addressLineOne addressLineTwo city state pinCode',
            )
            .populate('orderItems.product', 'productName productImageUrl')
            .select(
                'orderItems totalAmount status type deliveredAt dCreatedAt dUpdatedAt',
            )
            .sort({ dCreatedAt: -1 })
            .lean();

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

        return {
            statusCode: 200,
            success: true,
            message: 'Order retrieved successfully',
            data: oOrder,
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

export const editOrder = async (
    orderId: string,
    organisation: mongoose.Types.ObjectId,
    updateItems?: OrderItems[],
    totalAmount?: number,
): Promise<AsyncResponseType> => {
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

        const updateOrder = await Order.findByIdAndUpdate(
            oOrder._id,
            {
                orderItems: updateItems,
                totalAmount: totalAmount,
            },
            { new: true },
        );

        if (!updateOrder) {
            return {
                statusCode: 400,
                success: false,
                message: 'Failed to update order',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Order updated successfully',
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

export const acceptOrder = async (
    orderId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
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

        if (oOrder.status === 'inApproval') {
            const updateOrder = await Order.findByIdAndUpdate(
                oOrder._id,
                { status: 'approved' },
                { new: true },
            );

            if (!updateOrder) {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Failed to accept order',
                };
            }
        } else {
            if (oOrder.status === 'approved') {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Order is already approved',
                };
            } else if (oOrder.status === 'rejected') {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Order is already rejected',
                };
            } else if (oOrder.status === 'delivered') {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Order is already delivered',
                };
            }
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Order accepted successfully',
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

export const rejectOrder = async (
    orderId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
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

        if (oOrder.status === 'inApproval') {
            const updateOrder = await Order.findByIdAndUpdate(
                oOrder._id,
                { status: 'rejected' },
                { new: true },
            );

            if (!updateOrder) {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Failed to reject order',
                };
            }
        } else {
            if (oOrder.status === 'approved') {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Order is already approved',
                };
            } else if (oOrder.status === 'rejected') {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Order is already rejected',
                };
            } else if (oOrder.status === 'delivered') {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Order is already delivered',
                };
            }
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Order rejected successfully',
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

export const changeOrderStatus = async (
    orderId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
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

        if (oOrder.status === 'approved') {
            const updateOrder = await Order.findByIdAndUpdate(
                oOrder._id,
                { status: 'delivered' },
                { new: true },
            );

            if (!updateOrder) {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Failed to change the status',
                };
            }
        } else {
            if (oOrder.status === 'rejected') {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Order is already rejected',
                };
            } else if (oOrder.status === 'inApproval') {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Order is in approval',
                };
            } else if (oOrder.status === 'delivered') {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'Order is already delivered',
                };
            }
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Order delivered successfully',
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

export const createAdminOrders = async (
    customer: mongoose.Types.ObjectId,
    orderItems: OrderItems[],
    totalAmount: number,
    status: string,
    type: string = 'admin',
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const oCustomer = await User.findById({ _id: customer })
            .populate('organization', '_id')
            .lean();

        if (!oCustomer) {
            return {
                statusCode: 404,
                success: false,
                message: 'Customer not found',
            };
        }

        if (
            oCustomer.organization.some(
                (org) =>
                    org._id && org._id.toString() !== organisation.toString(),
            )
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'You do not have access to this customer',
            };
        }

        const oOrder = await Order.create({
            customer,
            orderItems,
            totalAmount,
            status,
            type,
            organization: organisation,
        });

        return {
            statusCode: 201,
            success: true,
            message: 'Order created successfully',
            data: oOrder,
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

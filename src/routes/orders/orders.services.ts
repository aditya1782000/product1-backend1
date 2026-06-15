import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
// import { myKafka } from '../../utils/kafka';
import Order from '../../models/orders';
import { Request } from 'express';
import User from '../../models/user';
import dataTable from '../../utils/dataTable';
import Product from '../../models/product';
import { ObjectId } from 'mongodb';

interface Filter {
    status?: string;
    from?: string;
    to?: string;
    firstName?: string[];
}

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

interface OrderItems {
    product: mongoose.Types.ObjectId;
    quantity: number;
    quantityType: string;
    unitPrice: number;
    totalPrice: number;
    color?: string;
}

export const createCustomerOrder = async (
    customer: mongoose.Types.ObjectId,
    orderItems: OrderItems[],
    totalAmount: number,
    status: string,
    organisation: mongoose.Types.ObjectId,
    deliveryAddress: string,
    billingOption?: string,
): Promise<AsyncResponseType> => {
    try {
        const currentDate = new Date();
        let startYear: number;
        let endYear: number;

        if (currentDate.getMonth() >= 3) {
            startYear = currentDate.getFullYear();
            endYear = currentDate.getFullYear() + 1;
        } else {
            startYear = currentDate.getFullYear() - 1;
            endYear = currentDate.getFullYear();
        }

        const ficalYearStart = new Date(`${startYear}-04-01`);
        const ficalYearEnd = new Date(`${endYear}-03-31`);

        const nOrderTotal = await Order.countDocuments({
            dCreatedAt: { $gte: ficalYearStart, $lt: ficalYearEnd },
            status: { $ne: 'rejected' },
            organization: organisation,
        });

        const orderNumber = `order ${nOrderTotal + 1}`;

        const orderData = {
            customer,
            orderItems,
            totalAmount,
            status,
            type: 'customer',
            organization: organisation,
            orderNumber,
            deliveryAddress: new ObjectId(deliveryAddress),
            orderFrom: 'Customer',
            billingOption,
        };

        // const producer = myKafka.producer();
        // await producer.connect();

        // await producer.send({
        //     topic: process.env.TOPIC_ONE || '',
        //     messages: [
        //         {
        //             value: JSON.stringify(orderData),
        //             key: orderData.organization.toString(),
        //         },
        //     ],
        // });

        // await producer.disconnect();

        const newOrder = new Order(orderData);
        await newOrder.save();

        return {
            statusCode: 200,
            success: true,
            message: 'Order created successfully',
            data: newOrder,
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
    _organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    return {
        statusCode: 200,
        success: true,
        message: 'Order notification service is disabled',
    };
    // const consumer = myKafka.consumer({
    //     groupId: `${process.env.GROUP_ID || 'order'}-${_organisation}`,
    //     sessionTimeout: 30000,
    //     heartbeatInterval: 3000,
    // });
    // await consumer.connect();
    // await consumer.subscribe({ topic: process.env.TOPIC_ONE || '', fromBeginning: true });
    // await consumer.run({
    //     eachMessage: async ({ message }) => {
    //         try {
    //             const orderData = JSON.parse(`${message.value}` || '');
    //             if (orderData.organization.toString() === _organisation.toString()) {
    //                 const order = await Order.findOne({ orderNumber: orderData.orderNumber, organization: orderData.organization });
    //                 if (order) {
    //                     global.io.to(_organisation.toString()).emit('Order-recieved', { message: 'A new order has been received.', orderDetails: order });
    //                 }
    //             }
    //         } catch (error) { console.error(error); }
    //     },
    // });
};

export const listPendingOrders = async (
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
            status: 'inApproval',
            organization: { $in: [organisation] },
        };

        const nRecordsTotal = await Order.countDocuments(orderQuery);

        const orders = await Order.find(orderQuery)
            .populate(
                'customer',
                '_id firstName lastName phoneNumber orgnaizationName',
            )
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

export const listCompletedOrders = async (
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
            status: { $in: ['approved', 'rejected', 'delivered'] },
            organization: { $in: [organisation] },
        };

        const nRecordsTotal = await Order.countDocuments(orderQuery);

        const orders = await Order.find(orderQuery)
            .populate(
                'customer',
                '_id firstName lastName phoneNumber orgnaizationName',
            )
            .select(
                'totalAmount dCreatedAt dUpdatedAt status orderNumber orderFrom',
            )
            .collation({ locale: 'en', strength: 1 })
            .sort({ dCreatedAt: -1 })
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
    start: number,
    limit: number,
): Promise<AsyncResponseType> => {
    try {
        const orders = await Order.find({
            customer: { $in: customer },
            status: 'inApproval',
            organization: { $in: organisation },
        })
            .populate(
                'customer',
                '_id firstName lastName phoneNumber addressLineOne addressLineTwo city state pinCode',
            )
            .populate('orderItems.product', 'productName productImageUrl')
            .populate(
                'deliveryAddress',
                '_id addressLineOne addressLineTwo city state pinCode customer organization',
            )
            .select(
                'status totalAmount dCreatedAt dUpdatedAt deliveredAt orderNumber orderItems invoiceUrl billingOption',
            )
            .skip(start)
            .limit(limit)
            .sort({ dCreatedAt: -1 })
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Customer pending orders retrieved successfully',
            data: orders,
            recordsTotal: orders.length,
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
    start: number,
    limit: number,
): Promise<AsyncResponseType> => {
    try {
        const orders = await Order.find({
            customer: { $in: customer },
            status: { $in: ['approved', 'rejected', 'delivered'] },
            organization: { $in: organisation },
        })
            .populate(
                'customer',
                '_id firstName lastName phoneNumber addressLineOne addressLineTwo city state pinCode',
            )
            .populate('orderItems.product', 'productName productImageUrl')
            .populate(
                'deliveryAddress',
                '_id addressLineOne addressLineTwo city state pinCode customer organization',
            )
            .select(
                'status totalAmount dCreatedAt dUpdatedAt deliveredAt orderNumber orderItems invoiceUrl billingOption',
            )
            .skip(start)
            .limit(limit)
            .sort({ dCreatedAt: -1 })
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Customer Completed orders retrieved successfully',
            data: orders,
            recordsTotal: orders.length,
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
                '_id firstName lastName phoneNumber addressLineOne addressLineTwo city state pinCode orgnaizationName gstNumber',
            )
            .populate('orderItems.product', 'productName productImageUrl')
            .populate(
                'deliveryAddress',
                '_id addressLineOne addressLineTwo city state pinCode customer organization',
            )
            .select(
                'orderItems totalAmount status type deliveredAt dCreatedAt dUpdatedAt orderNumber invoiceUrl orderFrom billingOption',
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
            .populate(
                'deliveryAddress',
                '_id addressLineOne addressLineTwo city state pinCode customer organization',
            )
            .select(
                'orderItems totalAmount status type deliveredAt dCreatedAt dUpdatedAt orderNumber billingOption',
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

        global.io.to(oOrder.customer.toString()).emit('Order-accepted', {
            message: `Your ${oOrder.orderNumber} has been accepted`,
        });

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
                { status: 'rejected', orderNumber: null },
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

        global.io.to(oOrder.customer.toString()).emit('Order-rejected', {
            message: `Your ${oOrder.orderNumber} has been rejected`,
        });

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
                { status: 'delivered', deliveredAt: Date.now() },
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

        global.io.to(oOrder.customer.toString()).emit('Order-delivered', {
            message: `Your ${oOrder.orderNumber} has been delivered`,
        });

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
    organisation: mongoose.Types.ObjectId,
    deliveryAddress: string,
    billingOption?: string,
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

        const currentDate = new Date();
        let startYear: number;
        let endYear: number;

        if (currentDate.getMonth() >= 3) {
            startYear = currentDate.getFullYear();
            endYear = currentDate.getFullYear() + 1;
        } else {
            startYear = currentDate.getFullYear() - 1;
            endYear = currentDate.getFullYear();
        }

        const ficalYearStart = new Date(`${startYear}-04-01`);
        const ficalYearEnd = new Date(`${endYear}-03-31`);

        const nOrderTotal = await Order.countDocuments({
            dCreatedAt: { $gte: ficalYearStart, $lt: ficalYearEnd },
            status: { $ne: 'rejected' },
            organization: organisation,
        });

        const orderNumber = `order ${nOrderTotal + 1}`;

        const oOrder = await Order.create({
            customer,
            orderItems,
            totalAmount,
            status: 'approved',
            type: 'admin',
            organization: organisation,
            orderNumber,
            orderFrom: 'Admin',
            deliveryAddress: new ObjectId(deliveryAddress),
            billingOption,
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

export const deleteOrder = async (
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

        await Order.findByIdAndDelete(oOrder._id);

        return {
            statusCode: 200,
            success: true,
            message: 'Order deleted successfully',
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

export const customerList = async (
    req: Request,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const searchFields = ['firstName', 'lastName'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'srNo');

        const customers = await User.find({
            $and: [oData.oSearchData],
            role: 'customer',
            organization: { $in: organisation },
            isDeleted: { $ne: true },
        })
            .select(
                '_id firstName lastName phoneNumber type addressLineOne addressLineTwo city state pinCode',
            )
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Customers fetched successfully',
            data: customers,
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

export const productsList = async (
    req: Request,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const searchFields = ['productName'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'srNo');

        const products = await Product.find({
            $and: [oData.oSearchData],
            organization: { $in: organisation },
            isDeleted: { $ne: true },
        })
            .select(
                '_id productName productImageUrl price colors pricingType singlePrice areaSinglePrice customerTypeSingleAreaPrice',
            )
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Products fetched successfully',
            data: products,
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

export const getCustomerOrderList = async (
    req: Request,
    start: number,
    limit: number,
    customerId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const orderQuery = {
            customer: customerId,
            status: { $in: ['approved', 'rejected', 'delivered'] },
            organization: { $in: organisation },
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
            message: 'Orders fetched successfully',
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

export const updateBillingOption = async (
    orderId: string,
    billingOption: string,
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

        await Order.findByIdAndUpdate(orderId, {
            billingOption: billingOption,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Billing Options is updated successfully.',
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

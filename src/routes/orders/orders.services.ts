import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import { myKafka } from '../../utils/kafka';

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
            organisation,
        };

        const producer = myKafka.producer();
        await producer.connect();

        await producer.send({
            topic: process.env.TOPIC_ONE || '',
            messages: [
                {
                    value: JSON.stringify(order),
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

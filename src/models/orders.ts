import mongoose, { Document, Model, Schema } from 'mongoose';
import data from '../../enum';

export interface IOrderItem extends Document {
    product: mongoose.Types.ObjectId;
    quantity: number;
    quantityType: string;
    unitPrice: number;
    totalPrice: number;
    color?: string;
}

export interface IOrder extends Document {
    customer: mongoose.Types.ObjectId;
    orderItems: IOrderItem[];
    totalAmount: number;
    status: string;
    type: string;
    organization: mongoose.Types.ObjectId;
    deliveredAt: Date;
    invoiceUrl: string;
    invoiceNo: string;
    orderNumber: string;
    deliveryAddress?: mongoose.Types.ObjectId;
    orderFrom?: string;
    billingOption?: string;
    dCreatedAt?: Date;
}

const orderItemSchema: Schema<IOrderItem> = new Schema<IOrderItem>({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },
    quantity: {
        type: Number,
        required: true,
    },
    quantityType: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    color: String,
});

const orderSchema: Schema<IOrder> = new Schema<IOrder>(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        orderItems: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: data.orderStatus,
            default: 'inApproval',
        },
        type: {
            type: String,
            required: true,
            enum: data.orderType,
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'organisation',
        },
        deliveredAt: Date,
        invoiceUrl: String,
        invoiceNo: String,
        deliveryAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeliveryAddress',
        },
        orderNumber: {
            type: String,
            required: true,
        },
        orderFrom: String,
        billingOption: String,
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const Order: Model<IOrder> = mongoose.model<IOrder>('orders', orderSchema);

export default Order;

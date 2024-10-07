import mongoose, { Document, Model, Schema } from 'mongoose';
import data from '../../enum';

export interface IOrderItem extends Document {
    product: mongoose.Types.ObjectId;
    quantity: number;
    quantityType: string;
    unitPrice: number;
    totalPrice: number;
}

export interface IOrder extends Document {
    customer: mongoose.Types.ObjectId;
    orderItems: IOrderItem[];
    totalAmount: number;
    status: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    deliveredAt: Date;
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
});

const orderSchema: Schema<IOrder> = new Schema<IOrder>({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
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
    type: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deliveredAt: Date,
});

const Order: Model<IOrder> = mongoose.model<IOrder>('orders', orderSchema);

export default Order;

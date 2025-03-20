import mongoose, { Document, Model, Schema } from 'mongoose';
// import data from '../../enum';

export interface IQuantityPrice extends Document {
    quantityType: string;
    price: number;
}

export interface IAreaPrice extends Document {
    area: string;
    prices: IQuantityPrice[];
}

export interface IProduct extends Document {
    productName: string;
    description: string;
    howToUse: string;
    productImageUrl: string;
    unitType: string;
    price: IAreaPrice[];
    organization: mongoose.Types.ObjectId;
    isActive?: boolean;
}

export const quantityPriceSchema: Schema<IQuantityPrice> =
    new Schema<IQuantityPrice>({
        quantityType: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    });

export const areaPriceSchema: Schema<IAreaPrice> = new Schema<IAreaPrice>({
    area: {
        type: String,
        required: true,
    },
    prices: [quantityPriceSchema],
});

export const productSchema: Schema<IProduct> = new Schema<IProduct>(
    {
        productName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        howToUse: {
            type: String,
        },
        productImageUrl: String,
        unitType: {
            type: String,
            required: true,
            // enum: data.unitType,
        },
        price: [areaPriceSchema],
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'organisation',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
    'product',
    productSchema,
);

export default Product;

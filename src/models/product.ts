import mongoose, { Document, Model, Schema } from 'mongoose';
import data from '../../enum';

export interface IQuantityPrice extends Document {
    quantityType: string;
    price: number;
}

export interface ICustomerTypePrice extends Document {
    customerType: string;
    prices: IQuantityPrice[];
}

export interface IAreaPrice extends Document {
    area: string;
    customerTypePrices: ICustomerTypePrice[];
}

export interface ISinglePrice extends Document {
    quantityType: string;
    price: number;
}

export interface IAreaSinglePrice extends Document {
    area: string;
    prices: ISinglePrice[];
}

export interface ICustomerTypeSingleAreaPrice extends Document {
    customerType: string;
    prices: ISinglePrice[];
}

export interface IProduct extends Document {
    productName: string;
    description: string;
    howToUse: string;
    productImageUrl: string;
    unitType: string;
    pricingType: string;
    price?: IAreaPrice[];
    singlePrice?: ISinglePrice[];
    areaSinglePrice?: IAreaSinglePrice[];
    customerTypeSingleAreaPrice?: ICustomerTypeSingleAreaPrice[];
    category: string;
    colors: string[];
    gstPercentage: number;
    productType: string;
    organization: mongoose.Types.ObjectId;
    isActive?: boolean;
    isDeleted?: boolean;
}

export const quantityPriceSchema: Schema<IQuantityPrice> =
    new Schema<IQuantityPrice>({
        quantityType: {
            type: String,
        },
        price: {
            type: Number,
        },
    });

export const customerTypePriceSchema: Schema<ICustomerTypePrice> =
    new Schema<ICustomerTypePrice>({
        customerType: String,
        prices: [quantityPriceSchema],
    });

export const areaPriceSchema: Schema<IAreaPrice> = new Schema<IAreaPrice>({
    area: {
        type: String,
        required: true,
    },
    customerTypePrices: [customerTypePriceSchema],
});

export const singlePriceSchema: Schema<ISinglePrice> = new Schema<ISinglePrice>(
    {
        quantityType: {
            type: String,
        },
        price: {
            type: Number,
        },
    },
);

export const areaSinglePriceSchema: Schema<IAreaSinglePrice> =
    new Schema<IAreaSinglePrice>({
        area: String,
        prices: [singlePriceSchema],
    });

export const customerTypeAreSinglePriceSchema: Schema<ICustomerTypeSingleAreaPrice> =
    new Schema<ICustomerTypeSingleAreaPrice>({
        customerType: String,
        prices: [singlePriceSchema],
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
        pricingType: {
            type: String,
            required: true,
            enum: data.pricingType,
        },
        price: [areaPriceSchema],
        singlePrice: [singlePriceSchema],
        areaSinglePrice: [areaSinglePriceSchema],
        customerTypeSingleAreaPrice: [customerTypeAreSinglePriceSchema],
        category: {
            type: String,
            required: true,
        },
        colors: [String],
        gstPercentage: Number,
        productType: {
            type: String,
            required: true,
            enum: data.productType,
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'organisation',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: Boolean,
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const Product: Model<IProduct> = mongoose.model<IProduct>(
    'product',
    productSchema,
);

export default Product;

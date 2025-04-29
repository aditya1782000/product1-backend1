import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProductCategory extends Document {
    category: string;
    isActive: boolean;
    organization: mongoose.Types.ObjectId;
}

const ProductCategorySchema: Schema<IProductCategory> =
    new Schema<IProductCategory>(
        {
            category: { type: String, required: true },
            isActive: {
                type: Boolean,
                default: true,
            },
            organization: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'organisation',
            },
        },
        { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
    );

const ProductCategory: Model<IProductCategory> =
    mongoose.model<IProductCategory>('ProductCategory', ProductCategorySchema);

export default ProductCategory;

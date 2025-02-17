import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import Product, { IProduct } from '../../models/product';

type ProductSearchQuery = mongoose.FilterQuery<IProduct> & {
    organization: mongoose.Types.ObjectId;
    isActive: boolean;
    'price.area'?: number;
    $or?: Array<{
        [key in 'productName' | 'description' | 'howToUse']?: {
            $regex: RegExp | string;
            $options: string;
        };
    }>;
};
export const productSearch = async (
    keyWord: string,
    pinCode: number,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const query: ProductSearchQuery = {
            organization: organisation,
            isActive: true,
            'price.area': pinCode,
        };

        if (keyWord.trim()) {
            query.$or = [{ productName: { $regex: keyWord, $options: 'i' } }];
        }

        const products = await Product.find(query, { 'price.$': 1 })
            .select('productName description howToUse productImageUrl')
            .skip(start)
            .limit(limit)
            .sort({ dCreatedAt: 1 })
            .lean();

        if (!products.length) {
            return {
                statusCode: 404,
                success: false,
                message: 'No products found',
            };
        }

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

import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import ProductCategory from '../../models/productCategory';

export const createProductCategory = async (
    category: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        await ProductCategory.create({
            category,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Product Category created successfully',
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

export const listProductCategory = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const productCategories = await ProductCategory.find({
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Product Categories retrieved successfully',
            data: productCategories,
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

export const deleteProductCategory = async (
    id: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const productCategory = await ProductCategory.findById(id);

        if (!productCategory) {
            return {
                statusCode: 404,
                success: false,
                message: 'Product Category not found',
            };
        }

        if (
            productCategory.organization &&
            productCategory.organization._id.toString() !==
                organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await ProductCategory.findByIdAndDelete(id);

        return {
            statusCode: 200,
            success: true,
            message: 'Product Category deleted successfully',
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

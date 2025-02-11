import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import Product from '../../models/product';
import { Request } from 'express';
import {
    deleteFileFromS3,
    extractS3Key,
    uploadFileToS3,
} from '../../utils/aws';
import fs from 'fs';
import dataTable from '../../utils/dataTable';

interface QuantityPrice {
    quantityType: string;
    price: number;
}

interface AreaPrice {
    area: string;
    prices: QuantityPrice[];
}

const deleteTempFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    });
};

export const addProduct = async (
    req: Request,
    productName: string,
    description: string,
    howToUse: string,
    unitType: string,
    price: AreaPrice[],
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    let tempFilePath: string | undefined;
    try {
        const existingProduct = await Product.findOne({
            productName,
            organization: organisation,
        });

        if (existingProduct) {
            return {
                statusCode: 409,
                success: false,
                message: 'Product with this name already exists',
            };
        }

        let productImageUrl: string | undefined;

        if (req.file) {
            tempFilePath = req.file.path;
            const uploadData = await uploadFileToS3(
                req.file,
                `${Date.now().toString()}`,
                'order',
            );
            productImageUrl = uploadData.Location;
        }

        const oProduct = await Product.create({
            productName,
            description,
            howToUse,
            productImageUrl,
            unitType,
            price,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Product added successfully',
            data: oProduct,
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
    } finally {
        if (tempFilePath) {
            deleteTempFile(tempFilePath);
        }
    }
};

export const listProducts = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const searchFields = ['productName'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'srNo');

        const nRecordsTotal = await Product.countDocuments({
            organization: { $in: organisation },
        });

        const productList = await Product.find({
            $and: [oData.oSearchData],
            organization: { $in: organisation },
        })
            .select('productName description isActive')
            .collation({ locale: 'en', strength: 1 })
            .sort(oData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Products list fetched successfully',
            data: productList,
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

export const productView = async (
    productId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const selectedFields =
            'productName description howToUse productImageUrl unitType price isActive organization';

        const oProduct = await Product.findById({ _id: productId })
            .select(selectedFields)
            .lean();

        if (!oProduct) {
            return {
                statusCode: 404,
                success: false,
                message: 'Product not found',
            };
        }

        if (
            oProduct.organization &&
            oProduct.organization._id.toString() !== organisation.toString()
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
            message: 'Product fetched successfully',
            data: oProduct,
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

export const productToggleStatus = async (
    productId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const oProduct = await Product.findById({ _id: productId }).populate(
            'organization',
            '_id',
        );

        if (!oProduct) {
            return {
                statusCode: 404,
                success: false,
                message: 'Product not found',
            };
        }

        if (
            oProduct.organization &&
            oProduct.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        const updateProduct = await Product.findByIdAndUpdate(
            productId,
            {
                isActive: !oProduct.isActive,
            },
            { new: true },
        );

        if (!updateProduct) {
            return {
                statusCode: 500,
                success: false,
                message: 'Failed to update product status',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Product status toggled successfully',
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

export const productEdit = async (
    productId: string,
    req: Request,
    organisation: mongoose.Types.ObjectId,
    productName?: string,
    description?: string,
    howToUse?: string,
    unitType?: string,
    price?: AreaPrice[],
): Promise<AsyncResponseType> => {
    let tempFilePath: string | undefined;
    try {
        const oProduct = await Product.findById({ _id: productId }).populate(
            'organization',
            '_id',
        );

        if (!oProduct) {
            return {
                statusCode: 404,
                success: false,
                message: 'Product not found',
            };
        }

        if (
            oProduct.organization &&
            oProduct.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        let productImageUrl: string | undefined;

        if (req.file !== undefined) {
            if (oProduct.productImageUrl) {
                const key = extractS3Key(oProduct.productImageUrl);
                deleteFileFromS3(key);
            }
            tempFilePath = req.file.path;
            const uploadData = await uploadFileToS3(
                req.file,
                `${Date.now().toString()}`,
                'order',
            );
            productImageUrl = uploadData.Location;
        }

        const updateProduct = await Product.findByIdAndUpdate(oProduct._id, {
            productName,
            description,
            howToUse,
            productImageUrl,
            unitType,
            price,
        });

        if (!updateProduct) {
            return {
                statusCode: 500,
                success: false,
                message: 'Failed to update product',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Product updated successfully',
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
    } finally {
        if (tempFilePath) {
            deleteTempFile(tempFilePath);
        }
    }
};

export const productDelete = async (
    productId: string,
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    try {
        const oProduct = await Product.findById({ _id: productId }).select(
            'organization productImageUrl',
        );

        if (!oProduct) {
            return {
                statusCode: 404,
                success: false,
                message: 'Product not found',
            };
        }

        if (
            oProduct.organization &&
            oProduct.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        if (oProduct.productImageUrl) {
            const key = extractS3Key(oProduct.productImageUrl);
            deleteFileFromS3(key);
        }

        const deleteProduct = await Product.findByIdAndDelete(productId);

        if (!deleteProduct) {
            return {
                statusCode: 500,
                success: false,
                message: 'Failed to delete product',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Product deleted successfully',
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

export const customerProductList = async (
    organisation: mongoose.Types.ObjectId,
    pinCode: number,
    start: number,
    limit: number,
): Promise<AsyncResponseType> => {
    try {
        const products = await Product.find(
            {
                organization: { $in: organisation },
                isActive: true,
                'price.area': pinCode,
            },
            {
                'price.$': 1,
            },
        )
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

export const customerProductView = async (
    productId: string,
    organisation: mongoose.Types.ObjectId,
    pinCode: number,
): Promise<AsyncResponseType> => {
    try {
        const product = await Product.findById(
            {
                _id: productId,
                organization: { $in: organisation },
                isActive: true,
            },
            {
                price: {
                    $elemMatch: { area: pinCode },
                },
            },
        )
            .select('productName description howToUse productImageUrl')
            .lean();

        if (!product) {
            return {
                statusCode: 404,
                success: false,
                message: 'Product not found',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Product fetched successfully',
            data: product,
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

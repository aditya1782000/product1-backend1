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

interface CustomerTypePrice {
    customerType: string;
    prices: QuantityPrice[];
}

interface AreaPrice {
    area: string;
    customerTypePrices: CustomerTypePrice[];
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
    category: string,
    gstPercentage: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    let tempFilePath: string | undefined;
    try {
        // const existingProduct = await Product.findOne({
        //     productName,
        //     organization: organisation,
        //     isDeleted: { $ne: true },
        // });

        // if (existingProduct) {
        //     return {
        //         statusCode: 409,
        //         success: false,
        //         message: 'Product with this name already exists',
        //     };
        // }

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
            category,
            gstPercentage,
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
            isDeleted: { $ne: true },
        });

        const productList = await Product.find({
            $and: [oData.oSearchData],
            organization: { $in: organisation },
            isDeleted: { $ne: true },
        })
            .select('productName description isActive category')
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
            'productName description howToUse productImageUrl unitType price isActive organization category gstPercentage';

        const oProduct = await Product.findOne({
            _id: productId,
            isDeleted: { $ne: true },
        })
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
        const oProduct = await Product.findOne({
            _id: productId,
            isDeleted: { $ne: true },
        }).populate('organization', '_id');

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
    category?: string,
    gstPercentage?: number,
    price?: AreaPrice[],
): Promise<AsyncResponseType> => {
    let tempFilePath: string | undefined;
    try {
        const oProduct = await Product.findOne({
            _id: productId,
            isDeleted: { $ne: true },
        }).populate('organization', '_id');

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
            category,
            gstPercentage,
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
        const oProduct = await Product.findOne({
            _id: productId,
            isDeleted: { $ne: true },
        }).select('organization productImageUrl');

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

        const deleteProduct = await Product.findByIdAndUpdate(productId, {
            isDeleted: true,
        });

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
    customerType: string,
    category: string | undefined,
    start: number,
    limit: number,
): Promise<AsyncResponseType> => {
    try {
        const products = await Product.find(
            {
                organization: { $in: organisation },
                isActive: true,
                isDeleted: { $ne: true },
                'price.area': pinCode.toString(),
                ...(category && { category }),
            },
            {
                productName: 1,
                description: 1,
                howToUse: 1,
                productImageUrl: 1,
                price: 1,
                category: 1,
            },
        )
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

        const processedProducts = products
            .map((product) => {
                const areaPrice = product.price.find(
                    (p) => p.area === pinCode.toString(),
                );

                if (!areaPrice) {
                    return null;
                }

                if (
                    !areaPrice.customerTypePrices ||
                    !Array.isArray(areaPrice.customerTypePrices)
                ) {
                    return null;
                }

                const customerTypePrice = areaPrice.customerTypePrices.find(
                    (ctp) => ctp.customerType === customerType,
                );

                if (
                    !customerTypePrice ||
                    !customerTypePrice.prices ||
                    !Array.isArray(customerTypePrice.prices)
                ) {
                    return null;
                }

                return {
                    _id: product._id,
                    productName: product.productName,
                    description: product.description,
                    howToUse: product.howToUse,
                    productImageUrl: product.productImageUrl,
                    price: [
                        {
                            area: areaPrice.area,
                            prices: customerTypePrice.prices,
                        },
                    ],
                    category: product.category,
                };
            })
            .filter((product) => product !== null);

        if (!processedProducts.length) {
            return {
                statusCode: 404,
                success: false,
                message: 'No products found for the specified customer type',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Products fetched successfully',
            data: processedProducts,
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
                isDeleted: { $ne: true },
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

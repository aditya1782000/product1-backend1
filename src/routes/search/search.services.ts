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
    customerType: string,
): Promise<AsyncResponseType> => {
    try {
        const query: ProductSearchQuery = {
            organization: organisation,
            isActive: true,
            isDeleted: { $ne: true },
            'price.area': pinCode,
        };

        if (keyWord.trim()) {
            query.$or = [{ productName: { $regex: keyWord, $options: 'i' } }];
        }

        const products = await Product.find(query, {
            productName: 1,
            description: 1,
            howToUse: 1,
            productImageUrl: 1,
            price: 1,
        })
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

        const processedProducts = products
            .map((product) => {
                const areaPrice = product?.price?.find(
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

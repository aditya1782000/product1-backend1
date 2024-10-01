import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import Product from '../../models/product';
import { Request } from 'express';
import uploadFileToS3 from '../../utils/aws';
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
            message: 'Products fetched successfully',
            data: productList,
            draw: req.body.draw,
            recordsTotal: nRecordsTotal,
            recordsFiltered: nRecordsTotal,
        }
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

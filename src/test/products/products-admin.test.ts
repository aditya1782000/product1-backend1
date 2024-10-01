import request from 'supertest';
import app from '../test-env-config';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import Product from '../../models/product';
import mongoose from 'mongoose';

jest.mock('../../models/user');
jest.mock('../../models/product');
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
    sign: jest.fn(),
}));
jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual('mongoose');
    return {
        ...actualMongoose,
        connect: jest.fn(),
        connection: {
            ...actualMongoose.connection,
            db: {
                collection: jest.fn().mockReturnValue({
                    insertOne: jest
                        .fn()
                        .mockResolvedValue({ insertedId: 'mock-id' }),
                }),
            },
        },
    };
});

const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTZhYjBhMGVhMWZiNThmNmUzMmI5NCIsImlhdCI6MTcyNzU5MjQ0OCwiZXhwIjoxNzI4ODg4NDQ4fQ.z5RgxpCCaFI4dYW2mPB5izEBDH-Wq60OUlDR1OOF8A8';

describe('ADD PRODUCTS', () => {
    beforeAll(() => {
        mongoose.connect = jest.fn().mockResolvedValue(undefined);
    });

    beforeEach(() => jest.resetAllMocks());

    afterEach(() => jest.resetAllMocks());

    it('should return 200 if product add successfully', async () => {
        const organizationId = new mongoose.Types.ObjectId();

        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: [organizationId],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProduct = {
            productName: 'Test Product',
            description: 'Test Product Description',
            howToUse: 'Test Product How To Use',
            productImageUrl: 'test-product-image.jpg',
            unitType: 'KG',
            price: [
                {
                    area: 'Local',
                    prices: [
                        { quantityType: '1-2 kg', price: 5 },
                        { quantityType: '2-5 kg', price: 7 },
                    ],
                },
                {
                    area: 'International',
                    prices: [
                        { quantityType: '1-2 kg', price: 7 },
                        { quantityType: '2-5 kg', price: 9 },
                    ],
                },
            ],
            organization: organizationId,
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.findOne as jest.Mock).mockResolvedValue(null);
        (Product.create as jest.Mock).mockResolvedValue(mockProduct);

        const requestBody = {
            productName: 'Test Product',
            description: 'Test Product Description',
            howToUse: 'Test Product How To Use',
            productImageUrl: 'test-product-image.jpg',
            unitType: 'KG',
            price: [
                {
                    area: 'Local',
                    prices: [
                        { quantityType: '1-2 kg', price: 5 },
                        { quantityType: '2-5 kg', price: 7 },
                    ],
                },
                {
                    area: 'International',
                    prices: [
                        { quantityType: '1-2 kg', price: 7 },
                        { quantityType: '2-5 kg', price: 9 },
                    ],
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/products/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product added successfully');
    });

    // it('should return 409 if product already exists', async () => {
    //     const organizationId = new mongoose.Types.ObjectId();

    //     const mockAdmin = {
    //         _id: '1234',
    //         role: 'superAdmin',
    //         email: 'admin@example.com',
    //         permissions: [],
    //         isActive: true,
    //         organization: [organizationId],
    //     };

    //     (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);
    //     const mockProduct = {
    //         productName: 'Test Product',
    //         description: 'Test Product Description',
    //         howToUse: 'Test Product How To Use',
    //         productImageUrl: 'test-product-image.jpg',
    //         unitType: 'KG',
    //         price: [
    //             {
    //                 area: 'Local',
    //                 prices: [
    //                     { quantityType: '1-2 kg', price: 5 },
    //                     { quantityType: '2-5 kg', price: 7 },
    //                 ],
    //             },
    //             {
    //                 area: 'International',
    //                 prices: [
    //                     { quantityType: '1-2 kg', price: 7 },
    //                     { quantityType: '2-5 kg', price: 9 },
    //                 ],
    //             },
    //         ],
    //         organization: organizationId,
    //     };

    //     (User.findById as jest.Mock).mockReturnValue({
    //         select: jest.fn().mockReturnValue(mockAdmin),
    //     });
    //     (Product.findOne as jest.Mock).mockResolvedValue(mockProduct);

    //     const requestBody = {
    //         productName: 'Test Product',
    //         description: 'Test Product Description',
    //         howToUse: 'Test Product How To Use',
    //         productImageUrl: 'test-product-image.jpg',
    //         unitType: 'KG',
    //         price: [
    //             {
    //                 area: 'Local',
    //                 prices: [
    //                     { quantityType: '1-2 kg', price: 5 },
    //                     { quantityType: '2-5 kg', price: 7 },
    //                 ],
    //             },
    //             {
    //                 area: 'International',
    //                 prices: [
    //                     { quantityType: '1-2 kg', price: 7 },
    //                     { quantityType: '2-5 kg', price: 9 },
    //                 ],
    //             },
    //         ],
    //     };

    //     const response = await request(app)
    //         .post('/api/v1/admin/products/add')
    //         .send(requestBody)
    //         .set('authorization', `Bearer ${userToken}`);

    //     expect(response.status).toBe(409);
    // });

    it('should return 403 if token is not given', async () => {
        const requestBody = {
            productName: 'Test Product',
            description: 'Test Product Description',
            howToUse: 'Test Product How To Use',
            productImageUrl: 'test-product-image.jpg',
            unitType: 'KG',
            price: [
                {
                    area: 'Local',
                    prices: [
                        { quantityType: '1-2 kg', price: 5 },
                        { quantityType: '2-5 kg', price: 7 },
                    ],
                },
                {
                    area: 'International',
                    prices: [
                        { quantityType: '1-2 kg', price: 7 },
                        { quantityType: '2-5 kg', price: 9 },
                    ],
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/products/add')
            .send(requestBody);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });

    it('shoulld return 401 if unauthorized access', async () => {
        const organizationId = new mongoose.Types.ObjectId();

        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: [organizationId],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProduct = {
            productName: 'Test Product',
            description: 'Test Product Description',
            howToUse: 'Test Product How To Use',
            productImageUrl: 'test-product-image.jpg',
            unitType: 'KG',
            price: [
                {
                    area: 'Local',
                    prices: [
                        { quantityType: '1-2 kg', price: 5 },
                        { quantityType: '2-5 kg', price: 7 },
                    ],
                },
                {
                    area: 'International',
                    prices: [
                        { quantityType: '1-2 kg', price: 7 },
                        { quantityType: '2-5 kg', price: 9 },
                    ],
                },
            ],
            organization: organizationId,
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(null),
        });
        (Product.findOne as jest.Mock).mockResolvedValue(null);
        (Product.create as jest.Mock).mockResolvedValue(mockProduct);

        const requestBody = {
            productName: 'Test Product',
            description: 'Test Product Description',
            howToUse: 'Test Product How To Use',
            productImageUrl: 'test-product-image.jpg',
            unitType: 'KG',
            price: [
                {
                    area: 'Local',
                    prices: [
                        { quantityType: '1-2 kg', price: 5 },
                        { quantityType: '2-5 kg', price: 7 },
                    ],
                },
                {
                    area: 'International',
                    prices: [
                        { quantityType: '1-2 kg', price: 7 },
                        { quantityType: '2-5 kg', price: 9 },
                    ],
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/products/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 403 if user is inactive', async () => {
        const organizationId = new mongoose.Types.ObjectId();

        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            organization: [organizationId],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProduct = {
            productName: 'Test Product',
            description: 'Test Product Description',
            howToUse: 'Test Product How To Use',
            productImageUrl: 'test-product-image.jpg',
            unitType: 'KG',
            price: [
                {
                    area: 'Local',
                    prices: [
                        { quantityType: '1-2 kg', price: 5 },
                        { quantityType: '2-5 kg', price: 7 },
                    ],
                },
                {
                    area: 'International',
                    prices: [
                        { quantityType: '1-2 kg', price: 7 },
                        { quantityType: '2-5 kg', price: 9 },
                    ],
                },
            ],
            organization: organizationId,
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.findOne as jest.Mock).mockResolvedValue(null);
        (Product.create as jest.Mock).mockResolvedValue(mockProduct);

        const requestBody = {
            productName: 'Test Product',
            description: 'Test Product Description',
            howToUse: 'Test Product How To Use',
            productImageUrl: 'test-product-image.jpg',
            unitType: 'KG',
            price: [
                {
                    area: 'Local',
                    prices: [
                        { quantityType: '1-2 kg', price: 5 },
                        { quantityType: '2-5 kg', price: 7 },
                    ],
                },
                {
                    area: 'International',
                    prices: [
                        { quantityType: '1-2 kg', price: 7 },
                        { quantityType: '2-5 kg', price: 9 },
                    ],
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/products/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is inactive');
    });

    it('should return 400 if fields are misinng', async () => {
        const organizationId = new mongoose.Types.ObjectId();

        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: [organizationId],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProduct = {
            productName: 'Test Product',
            description: 'Test Product Description',
            howToUse: 'Test Product How To Use',
            productImageUrl: 'test-product-image.jpg',
            unitType: 'KG',
            price: [
                {
                    area: 'Local',
                    prices: [
                        { quantityType: '1-2 kg', price: 5 },
                        { quantityType: '2-5 kg', price: 7 },
                    ],
                },
                {
                    area: 'International',
                    prices: [
                        { quantityType: '1-2 kg', price: 7 },
                        { quantityType: '2-5 kg', price: 9 },
                    ],
                },
            ],
            organization: organizationId,
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.findOne as jest.Mock).mockResolvedValue(null);
        (Product.create as jest.Mock).mockResolvedValue(mockProduct);

        const requestBody = {
            // productName: 'Test Product',
            // description: 'Test Product Description',
            // howToUse: 'Test Product How To Use',
            productImageUrl: 'test-product-image.jpg',
            unitType: 'KG',
            price: [
                {
                    area: 'Local',
                    prices: [
                        { quantityType: '1-2 kg', price: 5 },
                        { quantityType: '2-5 kg', price: 7 },
                    ],
                },
                {
                    area: 'International',
                    prices: [
                        { quantityType: '1-2 kg', price: 7 },
                        { quantityType: '2-5 kg', price: 9 },
                    ],
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/products/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Product name is required');
        expect(response.body.errors[1].msg).toBe('Description is required');
        expect(response.body.errors[2].msg).toBe('How to use is required');
    });
});

describe('LIST PRODUCTS', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if products list fetched successfully', async () => {
        const organizationId = new mongoose.Types.ObjectId();

        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: organizationId,
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProducts = [
            {
                productName: 'Test Product',
                description: 'Test Product Description',
                howToUse: 'Test Product How To Use',
                productImageUrl: 'test-product-image.jpg',
                unitType: 'KG',
                price: [
                    {
                        area: 'Local',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                    {
                        area: 'International',
                        prices: [
                            { quantityType: '1-2 kg', price: 7 },
                            { quantityType: '2-5 kg', price: 9 },
                        ],
                    },
                ],
                organization: organizationId,
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.countDocuments as jest.Mock).mockReturnValueOnce(
            mockProducts.length,
        );
        (Product.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            collation: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const requestBody = {
            start: 0,
            length: 10,
            draw: 1,
            search: {
                value: '',
            },
            columns: [{ data: 'productName' }],
            order: [
                {
                    column: 0,
                    dir: 'desc',
                },
            ],
        };

        const response = await request(app)
            .get('/api/v1/admin/products/list')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            'Products list fetched successfully',
        );
    });

    it('should return 403 if token is not given', async () => {
        const requestBody = {
            start: 0,
            length: 10,
            draw: 1,
            search: {
                value: '',
            },
            columns: [{ data: 'productName' }],
            order: [
                {
                    column: 0,
                    dir: 'desc',
                },
            ],
        };

        const response = await request(app)
            .get('/api/v1/admin/products/list')
            .send(requestBody);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });

    it('should return 401 if unauthorized access', async () => {
        const organizationId = new mongoose.Types.ObjectId();

        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: organizationId,
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProducts = [
            {
                productName: 'Test Product',
                description: 'Test Product Description',
                howToUse: 'Test Product How To Use',
                productImageUrl: 'test-product-image.jpg',
                unitType: 'KG',
                price: [
                    {
                        area: 'Local',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                    {
                        area: 'International',
                        prices: [
                            { quantityType: '1-2 kg', price: 7 },
                            { quantityType: '2-5 kg', price: 9 },
                        ],
                    },
                ],
                organization: organizationId,
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(null),
        });
        (Product.countDocuments as jest.Mock).mockReturnValueOnce(
            mockProducts.length,
        );
        (Product.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            collation: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const requestBody = {
            start: 0,
            length: 10,
            draw: 1,
            search: {
                value: '',
            },
            columns: [{ data: 'productName' }],
            order: [
                {
                    column: 0,
                    dir: 'desc',
                },
            ],
        };

        const response = await request(app)
            .get('/api/v1/admin/products/list')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 403 if user is inactive', async () => {
        const organizationId = new mongoose.Types.ObjectId();

        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: false,
            organization: organizationId,
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProducts = [
            {
                productName: 'Test Product',
                description: 'Test Product Description',
                howToUse: 'Test Product How To Use',
                productImageUrl: 'test-product-image.jpg',
                unitType: 'KG',
                price: [
                    {
                        area: 'Local',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                    {
                        area: 'International',
                        prices: [
                            { quantityType: '1-2 kg', price: 7 },
                            { quantityType: '2-5 kg', price: 9 },
                        ],
                    },
                ],
                organization: organizationId,
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.countDocuments as jest.Mock).mockReturnValueOnce(
            mockProducts.length,
        );
        (Product.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            collation: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const requestBody = {
            start: 0,
            length: 10,
            draw: 1,
            search: {
                value: '',
            },
            columns: [{ data: 'productName' }],
            order: [
                {
                    column: 0,
                    dir: 'desc',
                },
            ],
        };

        const response = await request(app)
            .get('/api/v1/admin/products/list')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is inactive');
    });
});

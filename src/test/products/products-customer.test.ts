import request from 'supertest';
import app from '../test-env-config';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import Product from '../../models/product';

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

const customerToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTVhMTc0MzdkNDM4NmY2NjE1YzcyOSIsImlhdCI6MTcyODgxNTY0MSwiZXhwIjoxNzMwMTExNjQxfQ.9J9We6nDLqzs7ZGyqZjE_QyiFF9Kuz58v55RVIoFdiQ';

describe('LIST CUSTOMER PRODUCTS', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if products list fetched successfully', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'customer',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: '66e6ab0a0ea1fb58f6e32b90',
            pinCode: 123456,
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
                        area: '123456',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                ],
                organization: '66e6ab0a0ea1fb58f6e32b90',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const response = await request(app)
            .get('/api/v1/customer/products/list')
            .set('authorization', `Bearer ${customerToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Products fetched successfully');
    });

    it('should return 403 if token is not given', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'customer',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: '66e6ab0a0ea1fb58f6e32b90',
            pinCode: 123456,
        };

        const mockProducts = [
            {
                productName: 'Test Product',
                description: 'Test Product Description',
                howToUse: 'Test Product How To Use',
                productImageUrl: 'test-product-image.jpg',
                unitType: 'KG',
                price: [
                    {
                        area: '123456',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                ],
                organization: '66e6ab0a0ea1fb58f6e32b90',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const response = await request(app).get(
            '/api/v1/customer/products/list',
        );

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });

    it('should return 401 if unauthorized access', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'customer',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: '66e6ab0a0ea1fb58f6e32b90',
            pinCode: 123456,
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
                        area: '123456',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                ],
                organization: '66e6ab0a0ea1fb58f6e32b90',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(null),
        });
        (Product.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const response = await request(app)
            .get('/api/v1/customer/products/list')
            .set('authorization', `Bearer ${customerToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 403 if customer is not active', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'customer',
            email: 'admin@example.com',
            permissions: [],
            isActive: false,
            organization: '66e6ab0a0ea1fb58f6e32b90',
            pinCode: 123456,
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
                        area: '123456',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                ],
                organization: '66e6ab0a0ea1fb58f6e32b90',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const response = await request(app)
            .get('/api/v1/customer/products/list')
            .set('authorization', `Bearer ${customerToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is inactive');
    });

    it('should return 403 if role is not customer', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'admin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: '66e6ab0a0ea1fb58f6e32b90',
            pinCode: 123456,
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
                        area: '123456',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                ],
                organization: '66e6ab0a0ea1fb58f6e32b90',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const response = await request(app)
            .get('/api/v1/customer/products/list')
            .set('authorization', `Bearer ${customerToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 404 if products list is not found', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'customer',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: '66e6ab0a0ea1fb58f6e32b91',
            pinCode: 123456,
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });

        const response = await request(app)
            .get('/api/v1/customer/products/list')
            .set('authorization', `Bearer ${customerToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No products found');
    });
});

describe('VIEW CUSTOMER PRODUCTS', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if product fetched successfully', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'customer',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: '66e6ab0a0ea1fb58f6e32b90',
            pinCode: 123456,
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProducts = [
            {
                _id: '66fee1c7b051cfeabea77b13',
                productName: 'Test Product',
                description: 'Test Product Description',
                howToUse: 'Test Product How To Use',
                productImageUrl: 'test-product-image.jpg',
                unitType: 'KG',
                price: [
                    {
                        area: '123456',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                ],
                organization: '66e6ab0a0ea1fb58f6e32b90',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const responseBody = {
            id: '66fee1c7b051cfeabea77b13',
        };

        const response = await request(app)
            .get('/api/v1/customer/product/view')
            .send(responseBody)
            .set('authorization', `Bearer ${customerToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product fetched successfully');
    });

    it('should return 403 if token is not given', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'customer',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: '66e6ab0a0ea1fb58f6e32b90',
            pinCode: 123456,
        };

        const mockProducts = [
            {
                _id: '66fee1c7b051cfeabea77b13',
                productName: 'Test Product',
                description: 'Test Product Description',
                howToUse: 'Test Product How To Use',
                productImageUrl: 'test-product-image.jpg',
                unitType: 'KG',
                price: [
                    {
                        area: '123456',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                ],
                organization: '66e6ab0a0ea1fb58f6e32b90',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const responseBody = {
            id: '66fee1c7b051cfeabea77b13',
        };

        const response = await request(app)
            .get('/api/v1/customer/product/view')
            .send(responseBody);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });

    it('should return 401 if unauthorized access', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'customer',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: '66e6ab0a0ea1fb58f6e32b90',
            pinCode: 123456,
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProducts = [
            {
                _id: '66fee1c7b051cfeabea77b13',
                productName: 'Test Product',
                description: 'Test Product Description',
                howToUse: 'Test Product How To Use',
                productImageUrl: 'test-product-image.jpg',
                unitType: 'KG',
                price: [
                    {
                        area: '123456',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                ],
                organization: '66e6ab0a0ea1fb58f6e32b90',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(null),
        });
        (Product.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const responseBody = {
            id: '66fee1c7b051cfeabea77b13',
        };

        const response = await request(app)
            .get('/api/v1/customer/product/view')
            .send(responseBody)
            .set('authorization', `Bearer ${customerToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 403 if customer is not active', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'customer',
            email: 'admin@example.com',
            permissions: [],
            isActive: false,
            organization: '66e6ab0a0ea1fb58f6e32b90',
            pinCode: 123456,
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProducts = [
            {
                _id: '66fee1c7b051cfeabea77b13',
                productName: 'Test Product',
                description: 'Test Product Description',
                howToUse: 'Test Product How To Use',
                productImageUrl: 'test-product-image.jpg',
                unitType: 'KG',
                price: [
                    {
                        area: '123456',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                ],
                organization: '66e6ab0a0ea1fb58f6e32b90',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const responseBody = {
            id: '66fee1c7b051cfeabea77b13',
        };

        const response = await request(app)
            .get('/api/v1/customer/product/view')
            .send(responseBody)
            .set('authorization', `Bearer ${customerToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is inactive');
    });

    it('should return 403 if role is not customer', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'admin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: '66e6ab0a0ea1fb58f6e32b90',
            pinCode: 123456,
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockProducts = [
            {
                _id: '66fee1c7b051cfeabea77b13',
                productName: 'Test Product',
                description: 'Test Product Description',
                howToUse: 'Test Product How To Use',
                productImageUrl: 'test-product-image.jpg',
                unitType: 'KG',
                price: [
                    {
                        area: '123456',
                        prices: [
                            { quantityType: '1-2 kg', price: 5 },
                            { quantityType: '2-5 kg', price: 7 },
                        ],
                    },
                ],
                organization: '66e6ab0a0ea1fb58f6e32b90',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (Product.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockProducts),
        });

        const responseBody = {
            id: '66fee1c7b051cfeabea77b13',
        };

        const response = await request(app)
            .get('/api/v1/customer/product/view')
            .send(responseBody)
            .set('authorization', `Bearer ${customerToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 404 if product is not found', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'customer',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: '66e6ab0a0ea1fb58f6e32b91',
            pinCode: 123456,
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });

        const responseBody = {
            id: '66fee1c7b051cfeabea77b14',
        };

        const response = await request(app)
            .get('/api/v1/customer/product/view')
            .send(responseBody)
            .set('authorization', `Bearer ${customerToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Product not found');
    });
});

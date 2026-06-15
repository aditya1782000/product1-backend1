import request from 'supertest';
import app from '../test-env-config';
import User from '../../models/user';
import Organisation from '../../models/organisation';
import bcrypt from 'bcrypt';
import generatepassword from 'generate-password';
import jwt from 'jsonwebtoken';

jest.mock('../../models/user');
jest.mock('../../models/organisation');
jest.mock('bcrypt');
jest.mock('generate-password');
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
    sign: jest.fn(),
}));
jest.mock('../../utils/nodemailer', () => ({
    send: jest.fn(),
    sendMail: jest.fn(),
}));

const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTVhMTc0MzdkNDM4NmY2NjE1YzcyOSIsImlhdCI6MTcyODgxNTY0MSwiZXhwIjoxNzMwMTExNjQxfQ.9J9We6nDLqzs7ZGyqZjE_QyiFF9Kuz58v55RVIoFdiQ';

const userId: string = '66ec55fbc2935364c8caba8f';

describe('ADD USERS', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if subAdmin is added successfully', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockPassword = 'mockPassword123!';
        const mockHash = 'mockedHashedPassword';

        (generatepassword.generate as jest.Mock).mockReturnValue(mockPassword);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

        const mockUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'subAdmin',
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
            organization: ['12345678'],
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (Organisation.find as jest.Mock).mockResolvedValue([
            {
                _id: '12345678',
                organisationName: 'Test Organization',
            },
        ]);

        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'subAdmin',
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
            organization: ['12345678'],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Sub-Admin created successfully');
    });

    it('should return 200 if customer added successfully', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockPassword = 'mockPassword123!';
        const mockHash = 'mockedHashedPassword';

        (generatepassword.generate as jest.Mock).mockReturnValue(mockPassword);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

        const mockUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            role: 'customer',
            type: 'xyz',
            organization: ['12345678'],
            addressLineOne: '123 Main St',
            addressLineTwo: 'Apt 1',
            city: 'New York',
            state: 'NY',
            pinCode: '100011',
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (Organisation.find as jest.Mock).mockResolvedValue([
            {
                _id: '12345678',
                organisationName: 'Test Organization',
            },
        ]);

        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            role: 'customer',
            type: 'xyz',
            organization: ['12345678'],
            addressLineOne: '123 Main St',
            addressLineTwo: 'Apt 1',
            city: 'New York',
            state: 'NY',
            pinCode: '100011',
        };

        const response = await request(app)
            .post('/api/v1/admin/users/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Customer created successfully');
    });

    it('should return 200 if employee is added successfully', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockPassword = 'mockPassword123!';
        const mockHash = 'mockedHashedPassword';

        (generatepassword.generate as jest.Mock).mockReturnValue(mockPassword);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

        const mockUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            role: 'employee',
            organization: ['12345678'],
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (Organisation.find as jest.Mock).mockResolvedValue([
            {
                _id: '12345678',
                organisationName: 'Test Organization',
            },
        ]);

        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            role: 'employee',
            organization: ['12345678'],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Employee created successfully');
    });

    it('should return 400 if User already exists', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockPassword = 'mockPassword123!';
        const mockHash = 'mockedHashedPassword';

        (generatepassword.generate as jest.Mock).mockReturnValue(mockPassword);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.findOne as jest.Mock).mockResolvedValue({
            email: 'john.doe@example.com',
        });

        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            role: 'employee',
            organization: ['12345678'],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe(
            'User with this email already exists',
        );
    });

    it('should return 403 if token is not given', async () => {
        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            role: 'employee',
            organization: ['12345678'],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/add')
            .send(requestBody);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });

    it('should return 401 if unauthorized access', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockPassword = 'mockPassword123!';
        const mockHash = 'mockedHashedPassword';

        (generatepassword.generate as jest.Mock).mockReturnValue(mockPassword);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

        const mockUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            role: 'employee',
            organization: ['12345678'],
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(null),
        });
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (Organisation.find as jest.Mock).mockResolvedValue([
            {
                _id: '12345678',
                organisationName: 'Test Organization',
            },
        ]);

        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            role: 'employee',
            organization: ['12345678'],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 403 if user is inacive', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockPassword = 'mockPassword123!';
        const mockHash = 'mockedHashedPassword';

        (generatepassword.generate as jest.Mock).mockReturnValue(mockPassword);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

        const mockUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'subAdmin',
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
            organization: ['12345678'],
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (Organisation.find as jest.Mock).mockResolvedValue([
            {
                _id: '12345678',
                organisationName: 'Test Organization',
            },
        ]);

        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'subAdmin',
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
            organization: ['12345678'],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is inactive');
    });

    it('should return 400 if sub admin fields are missing', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockPassword = 'mockPassword123!';
        const mockHash = 'mockedHashedPassword';

        (generatepassword.generate as jest.Mock).mockReturnValue(mockPassword);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

        const mockUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'subAdmin',
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
            organization: ['12345678'],
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (Organisation.find as jest.Mock).mockResolvedValue([
            {
                _id: '12345678',
                organisationName: 'Test Organization',
            },
        ]);

        const requestBody = {
            firstName: 'John',
            role: 'subAdmin',
            organization: ['12345678'],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Last name is required');
        expect(response.body.errors[1].msg).toBe('Email is required');
        expect(response.body.errors[2].msg).toBe(
            'Permissions must be an array',
        );
    });

    it('should return 400 if customer fields are missing', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockPassword = 'mockPassword123!';
        const mockHash = 'mockedHashedPassword';

        (generatepassword.generate as jest.Mock).mockReturnValue(mockPassword);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

        const mockUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            role: 'customer',
            type: 'xyz',
            organization: ['12345678'],
            addressLineOne: '123 Main St',
            addressLineTwo: 'Apt 1',
            city: 'New York',
            state: 'NY',
            pinCode: '100011',
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (Organisation.find as jest.Mock).mockResolvedValue([
            {
                _id: '12345678',
                organisationName: 'Test Organization',
            },
        ]);

        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'customer',
            organization: ['12345678'],
            addressLineOne: '123 Main St',
            addressLineTwo: 'Apt 1',
            city: 'New York',
            state: 'NY',
            pinCode: '100011',
        };

        const response = await request(app)
            .post('/api/v1/admin/users/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Type is required');
    });

    it('should return 400 if employee fileds are missing', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockPassword = 'mockPassword123!';
        const mockHash = 'mockedHashedPassword';

        (generatepassword.generate as jest.Mock).mockReturnValue(mockPassword);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

        const mockUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            role: 'employee',
            organization: ['12345678'],
        };

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (Organisation.find as jest.Mock).mockResolvedValue([
            {
                _id: '12345678',
                organisationName: 'Test Organization',
            },
        ]);

        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'employee',
            organization: ['12345678'],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/add')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Phone number is required');
    });
});

describe('USERS LIST', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if sub admin list fetched successfully', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                role: 'subAdmin',
                permissions: [
                    {
                        eKey: 'ORDERS',
                        eType: ['AD', 'A', 'E', 'V', 'D'],
                    },
                ],
                organization: ['12345678'],
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.countDocuments as jest.Mock).mockReturnValueOnce(mockUser.length);
        (User.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            collation: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockUser),
        });

        const requestBody = {
            start: 0,
            length: 10,
            draw: 1,
            role: 'subAdmin',
            search: {
                value: '',
            },
            columns: [
                { data: 'firstName' },
                { data: 'lastName' },
                { data: 'email' },
            ],
            order: [
                {
                    column: 0,
                    dir: 'desc',
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/list')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Users fetched successfully');
    });

    it('should return 200 if customer list fetched successfully', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '+911234567890',
                role: 'customer',
                type: 'xyz',
                organization: ['12345678'],
                addressLineOne: '123 Main St',
                addressLineTwo: 'Apt 1',
                city: 'New York',
                state: 'NY',
                pinCode: '100011',
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.countDocuments as jest.Mock).mockReturnValueOnce(mockUser.length);
        (User.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            collation: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockUser),
        });

        const requestBody = {
            start: 0,
            length: 10,
            draw: 1,
            role: 'customer',
            search: {
                value: '',
            },
            columns: [
                { data: 'firstName' },
                { data: 'lastName' },
                { data: 'email' },
            ],
            order: [
                {
                    column: 0,
                    dir: 'desc',
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/list')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Users fetched successfully');
    });

    it('should return 200 if employee list fetched successfully', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '+911234567890',
                role: 'employee',
                organization: ['12345678'],
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.countDocuments as jest.Mock).mockReturnValueOnce(mockUser.length);
        (User.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            collation: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockUser),
        });

        const requestBody = {
            start: 0,
            length: 10,
            draw: 1,
            role: 'employee',
            search: {
                value: '',
            },
            columns: [
                { data: 'firstName' },
                { data: 'lastName' },
                { data: 'email' },
            ],
            order: [
                {
                    column: 0,
                    dir: 'desc',
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/list')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Users fetched successfully');
    });

    it('should return 403 if token is not given', async () => {
        const requestBody = {
            start: 0,
            length: 10,
            draw: 1,
            role: 'customer',
            search: {
                value: '',
            },
            columns: [
                { data: 'firstName' },
                { data: 'lastName' },
                { data: 'email' },
            ],
            order: [
                {
                    column: 0,
                    dir: 'desc',
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/list')
            .send(requestBody);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });

    it('should return 401 if unauthorized access', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '+911234567890',
                role: 'employee',
                organization: ['12345678'],
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(null),
        });
        (User.countDocuments as jest.Mock).mockReturnValueOnce(mockUser.length);
        (User.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            collation: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockUser),
        });

        const requestBody = {
            start: 0,
            length: 10,
            draw: 1,
            role: 'employee',
            search: {
                value: '',
            },
            columns: [
                { data: 'firstName' },
                { data: 'lastName' },
                { data: 'email' },
            ],
            order: [
                {
                    column: 0,
                    dir: 'desc',
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/list')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 403 if user is inactive', async () => {
        const mockAdmin = {
            _id: '1234',
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: false,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '+911234567890',
                role: 'employee',
                organization: ['12345678'],
            },
        ];

        (User.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.countDocuments as jest.Mock).mockReturnValueOnce(mockUser.length);
        (User.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            collation: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockUser),
        });

        const requestBody = {
            start: 0,
            length: 10,
            draw: 1,
            role: 'employee',
            search: {
                value: '',
            },
            columns: [
                { data: 'firstName' },
                { data: 'lastName' },
                { data: 'email' },
            ],
            order: [
                {
                    column: 0,
                    dir: 'desc',
                },
            ],
        };

        const response = await request(app)
            .post('/api/v1/admin/users/list')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is inactive');
    });
});

describe('USER VIEW', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if user is fetched', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = {
            _id: userId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'suAdmin',
            organization: ['12345678'],
            isActive: true,
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        (User.findById as jest.Mock)
            .mockReturnValueOnce({
                select: jest.fn().mockReturnValue(mockUser),
            })
            .mockReturnValueOnce({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnValueOnce(mockUser),
            });

        const response = await request(app)
            .get(`/api/v1/admin/user/${userId}/view`)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User fetched successfully');
    });

    it('should return 404 if user not found', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = {
            _id: userId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'suAdmin',
            organization: ['12345678'],
            isActive: true,
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        (User.findById as jest.Mock)
            .mockReturnValueOnce({
                select: jest.fn().mockReturnValue(mockUser),
            })
            .mockReturnValueOnce({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnValueOnce(null),
            });

        const response = await request(app)
            .get(`/api/v1/admin/user/${userId}/view`)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    it('should return 401 if user is not authorized', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = {
            _id: userId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'suAdmin',
            organization: ['12345678'],
            isActive: true,
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        (User.findById as jest.Mock)
            .mockReturnValueOnce({
                select: jest.fn().mockReturnValue(null),
            })
            .mockReturnValueOnce({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnValueOnce(mockUser),
            });

        const response = await request(app)
            .get(`/api/v1/admin/user/${userId}/view`)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 403 if organization does not match', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = {
            _id: userId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'suAdmin',
            organization: ['123456781'],
            isActive: true,
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        (User.findById as jest.Mock)
            .mockReturnValueOnce({
                select: jest.fn().mockReturnValue(mockUser),
            })
            .mockReturnValueOnce({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnValueOnce(mockUser),
            });

        const response = await request(app)
            .get(`/api/v1/admin/user/${userId}/view`)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('User is inactive');
    });

    it('should return 403 if token is not given', async () => {
        const mockUser = {
            _id: userId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'suAdmin',
            organization: ['123456781'],
            isActive: true,
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        (User.findById as jest.Mock)
            .mockReturnValueOnce({
                select: jest.fn().mockReturnValue(mockUser),
            })
            .mockReturnValueOnce({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnValueOnce(mockUser),
            });

        const response = await request(app).get(
            `/api/v1/admin/user/${userId}/view`,
        );

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });
});

describe('TOGGLE USER', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if toggled successfully', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = {
            _id: userId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'suAdmin',
            organization: [{ _id: '12345678' }],
            isActive: true,
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        (User.findById as jest.Mock)
            .mockReturnValueOnce({
                select: jest.fn().mockResolvedValue(null),
            })
            .mockReturnValueOnce({
                populate: jest.fn().mockReturnValueOnce(mockUser),
            });

        (User.findByIdAndUpdate as jest.Mock).mockReturnValue(mockUser);

        const response = await request(app)
            .patch(`/api/v1/admin/user/${userId}/toggle`)
            .set('authorization', `Bearer ${userToken}`)
            .send({});

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User status toggled successfully');
    });

    it('should return 403 if token is not given', async () => {
        const mockUser = {
            _id: '123456',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'suAdmin',
            organization: ['12345678'],
            isActive: true,
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        (User.findById as jest.Mock)
            .mockReturnValueOnce({
                select: jest.fn().mockReturnValue(mockUser),
            })
            .mockReturnValueOnce({
                populate: jest.fn().mockReturnValueOnce(mockUser),
            });

        const response = await request(app).patch(
            `/api/v1/admin/user/${userId}/toggle`,
        );

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });

    it('should return 401 if user is not authroized', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'suAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        (User.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockReturnValue(null),
        });

        const response = await request(app)
            .patch(`/api/v1/admin/user/${userId}/toggle`)
            .set('authorization', `bearer ${userToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('invalid token');
    });
});

describe('USER EDIT', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if user is updated successfully', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = {
            _id: userId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'suAdmin',
            organization: ['12345678'],
            isActive: true,
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        (User.findById as jest.Mock)
            .mockResolvedValue({
                select: jest.fn().mockReturnValue(mockUser),
            })
            .mockResolvedValue({
                lean: jest.fn().mockReturnValueOnce(mockUser),
            });
        (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

        const requestBody = {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            role: 'subAdmin',
            isActive: true,
            organization: ['12345678'],
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        const response = await request(app)
            .patch(`/api/v1/admin/user/${userId}/edit`)
            .set('authorization', `Bearer ${userToken}`)
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated successfully');
    });

    it('should return 403 if token is not given', async () => {
        const requestBody = {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            role: 'subAdmin',
            isActive: true,
            organization: ['12345678'],
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        const response = await request(app)
            .patch(`/api/v1/admin/user/${userId}/edit`)
            .send(requestBody);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });

    it('should return 403 if unathorized access', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'suAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        (User.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockReturnValue(null),
        });

        const requestBody = {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            role: 'subAdmin',
            isActive: true,
            organization: ['12345678'],
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        const response = await request(app)
            .patch(`/api/v1/admin/user/${userId}/edit`)
            .set('authorization', `Bearer ${userToken}`)
            .send(requestBody);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });
});

describe('USER DELETE', () => {
    beforeEach(() => jest.resetAllMocks());

    afterEach(() => jest.resetAllMocks());

    it('should return 200 if user is deleted successfully', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = {
            _id: userId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'suAdmin',
            organization: ['12345678'],
            isActive: true,
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        (User.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockReturnValue(mockAdmin),
        });
        (User.findById as jest.Mock).mockResolvedValue(mockUser);
        (User.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app)
            .delete(`/api/v1/admin/user/${userId}/delete`)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });

    it('should return 403 if token is not given', async () => {
        const response = await request(app).delete(
            `/api/v1/admin/user/${userId}/delete`,
        );

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });

    it('should return 401 if unathorized access', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        (User.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockReturnValue(null),
        });

        const response = await request(app)
            .delete(`/api/v1/admin/user/${userId}/delete`)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 404 if user not found', async () => {
        const mockAdmin = {
            _id: userId,
            role: 'superAdmin',
            email: 'admin@example.com',
            permissions: [],
            isActive: true,
            organization: ['12345678'],
        };

        (jwt.verify as jest.Mock).mockResolvedValue(mockAdmin);

        const mockUser = {
            _id: userId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'suAdmin',
            organization: ['12345678'],
            isActive: true,
            permissions: [
                {
                    eKey: 'ORDERS',
                    eType: ['AD', 'A', 'E', 'V', 'D'],
                },
            ],
        };

        (User.findById as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockReturnValue(mockUser),
        });
        (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .delete(`/api/v1/admin/user/${userId}/delete`)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });
});

import request from 'supertest';
import app from '../test-env-config';
import Organisation from '../../models/organisation';
import User from '../../models/user';
import Registration from '../../models/register';
import bcrypt from 'bcrypt';
import generatepassword from 'generate-password';

jest.mock('../../models/register');
jest.mock('../../models/user');
jest.mock('../../models/organisation');
jest.mock('bcrypt');
jest.mock('generate-password');

describe('REGISTER USER', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if register organisation and user', async () => {
        const mockPassword = 'mockPassword123!';
        const mockHash = 'mockedHashedPassword';

        (generatepassword.generate as jest.Mock).mockReturnValue(mockPassword);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

        const mockOrganisation = {
            _id: '12345678',
            organisationName: 'Test Org',
            gstNumber: '21AAAAA0000A1Z5',
            addressLineone: '123 Main St',
            addressLineTwo: 'Apt 1',
            city: 'New York',
            state: 'NY',
            pinCode: 10001,
        };

        const mockUser = {
            firstName: 'Johnt',
            lastName: 'Doeff',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            hash: mockHash,
            role: 'superAdmin',
            organization: [mockOrganisation._id],
        };

        const mockRegistration = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: 911234567890,
            organisations: [mockOrganisation._id],
            plan: 'Basic',
            place: 'Home',
        };

        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            organisationName: 'Test Org',
            gstNumber: '21AAAAA0000A1Z5',
            addressLineone: '123 Main St',
            addressLineTwo: 'Apt 1',
            city: 'New York',
            state: 'NY',
            pinCode: '100011',
            plan: 'basic',
            place: 'Home',
        };

        (Organisation.create as jest.Mock).mockResolvedValue(mockOrganisation);
        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (Registration.findOne as jest.Mock).mockResolvedValue(null);
        (Registration.create as jest.Mock).mockResolvedValue(mockRegistration);

        const response = await request(app)
            .post('/api/v1/register/user')
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('You have registered successfully');
    });

    it('should return 409 if user already exists', async () => {
        (Registration.findOne as jest.Mock).mockResolvedValue({
            email: 'john.doe@example.com',
        });

        const requestBody = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+911234567890',
            organisationName: 'Test Org',
            gstNumber: '21AAAAA0000A1Z5',
            addressLineone: '123 Main St',
            addressLineTwo: 'Apt 1',
            city: 'New York',
            state: 'NY',
            pinCode: '100011',
            plan: 'basic',
            place: 'Home',
        };

        const response = await request(app)
            .post('/api/v1/register/user')
            .send(requestBody);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe(
            'User with this email already exists',
        );
    });
});

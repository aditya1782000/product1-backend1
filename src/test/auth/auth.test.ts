import request from 'supertest';
import app from '../test-env-config';
import User from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

jest.mock('../../models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('crypto');

const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTZhYjBhMGVhMWZiNThmNmUzMmI5NCIsImlhdCI6MTcyNjkyNjgxMywiZXhwIjoxNzI3MDEzMjEzfQ.egyeDBnQOoN5heR_FmwFBMfk3s2dnLjrH_GWwvhP-Qo';

describe('USER LOGIN', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if user exists and password is correct', async () => {
        const mockUser = {
            email: 'john.doe@example.com',
            password: 'mockPassword123!',
        };

        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('token');

        const requestBody = {
            email: 'john.doe@example.com',
            password: 'mockPassword123!',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/login')
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User logged in successfully');
    });

    it('should return 406 if password is invalid', async () => {
        const mockUser = {
            email: 'john.doe@example.com',
            password: 'mockPassword123!',
        };

        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const requestBody = {
            email: 'john.doe@example.com',
            password: 'invalidPassword',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/login')
            .send(requestBody);

        expect(response.status).toBe(406);
        expect(response.body.message).toBe('Invalid password');
    });

    it('should return 406 if user is not active', async () => {
        const mockUser = {
            email: 'john.doe@example.com',
            password: 'mockPassword123!',
            isActive: false,
        };

        (User.findOne as jest.Mock).mockResolvedValue(mockUser);

        const requestBody = {
            email: 'john.doe@example.com',
            password: 'mockPassword123!',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/login')
            .send(requestBody);

        expect(response.status).toBe(406);
        expect(response.body.message).toBe('User is not active');
    });

    it('should return 404 if user not found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        const requestBody = {
            email: 'john.doe@example.com',
            password: 'mockPassword123!',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/login')
            .send(requestBody);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });
});

describe('POST PASSWORD RESET', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if user exists and password reset link is sent', async () => {
        (User.findOneAndUpdate as jest.Mock).mockResolvedValue({
            email: 'john.doe@example.com',
            save: jest.fn(),
        });
        (crypto.randomBytes as jest.Mock).mockResolvedValue(
            Buffer.from('mockRandomHash'),
        );

        const requestBody = {
            email: 'john.doe@example.com',
        };

        const response = await request(app)
            .post('/api/v1/admin/password/reset')
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            'Password reset link has been sent to your email',
        );
    });

    it('should return 404 if user not found', async () => {
        (User.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

        const requestBody = {
            email: 'john.doe@example.com',
        };

        const response = await request(app)
            .post('/api/v1/admin/password/reset')
            .send(requestBody);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    it('should return 406 if user is not active', async () => {
        (User.findOneAndUpdate as jest.Mock).mockResolvedValue({
            email: 'john.doe@example.com',
            isActive: false,
            save: jest.fn(),
        });

        const requestBody = {
            email: 'john.doe@example.com',
        };

        const response = await request(app)
            .post('/api/v1/admin/password/reset')
            .send(requestBody);

        expect(response.status).toBe(406);
        expect(response.body.message).toBe('User is not active');
    });
});

describe('GET PASSWORD RESET', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if token is valid and user exists', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            resetPasswordToken: 'mockToken',
            resetPasswordExpires: { $gt: Date.now() },
        });

        const requestBody = {
            resetPasswordToken: 'mockToken',
            resetPasswordExpires: { $gt: Date.now() },
        };

        const response = await request(app)
            .get('/api/v1/admin/password/token/reset')
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password reset token is valid');
    });

    it('should return 406 if user is not active', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            isActive: false,
        });

        const requestBody = {
            resetPasswordToken: 'mockToken',
            resetPasswordExpires: { $gt: Date.now() },
        };

        const response = await request(app)
            .get('/api/v1/admin/password/token/reset')
            .send(requestBody);

        expect(response.status).toBe(406);
        expect(response.body.message).toBe('User is not active');
    });

    it('should return 417 if token is invalid', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        const requestBody = {
            resetPasswordToken: 'invalidToken',
            resetPasswordExpires: { $gt: Date.now() },
        };

        const response = await request(app)
            .get('/api/v1/admin/password/token/reset')
            .send(requestBody);

        expect(response.status).toBe(417);
        expect(response.body.message).toBe(
            'Password reset token is invalid or expired',
        );
    });
});

describe('POST RESET PASSWORD', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if user exists and password is updated', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            resetPasswordToken: 'invalidToken',
            resetPasswordExpires: { $gt: Date.now() },
            save: jest.fn(),
        });

        (bcrypt.hash as jest.Mock).mockResolvedValue('newPassword123');

        const requestBody = {
            resetPasswordToken: 'mockToken',
            resetPasswordExpires: { $gt: Date.now() },
            password: 'newPassword123!',
            confirmPassword: 'newPassword123!',
        };

        const response = await request(app)
            .post('/api/v1/admin/password/token/reset')
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            'Password has been reset successfully',
        );
    });

    it('should return 406 if password and confirm password do not match', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            resetPasswordToken: 'invalidToken',
            resetPasswordExpires: { $gt: Date.now() },
            save: jest.fn(),
        });

        (bcrypt.hash as jest.Mock).mockResolvedValue('newPassword123');

        const requestBody = {
            resetPasswordToken: 'mockToken',
            resetPasswordExpires: { $gt: Date.now() },
            password: 'newPassword123!',
            confirmPassword: 'wrongPassword!',
        };

        const response = await request(app)
            .post('/api/v1/admin/password/token/reset')
            .send(requestBody);

        expect(response.status).toBe(406);
        expect(response.body.message).toBe('Passwords do not match');
    });

    it('should return 417 if token is not valid', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        (bcrypt.hash as jest.Mock).mockResolvedValue('newPassword123');

        const requestBody = {
            resetPasswordToken: 'invalidToken',
            resetPasswordExpires: { $gt: Date.now() },
            password: 'newPassword123!',
            confirmPassword: 'newPassword123!',
        };

        const response = await request(app)
            .post('/api/v1/admin/password/token/reset')
            .send(requestBody);

        expect(response.status).toBe(417);
        expect(response.body.message).toBe(
            'Password reset token is invalid or expired',
        );
    });
});

describe('LOGOUT USER', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if user is logged out', async () => {
        (jwt.verify as jest.Mock).mockResolvedValue({ token: userToken });
        (User.findById as jest.Mock).mockResolvedValue({ token: userToken });
        (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({
            userId: 'mockUserId',
            token: '',
            save: jest.fn(),
        });

        const requestBody = {
            userId: 'mockUserId',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/logout')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User logged out successfully');
    });

    it('should return 403 if token is not provided', async () => {
        const requestBody = {
            userId: 'mockUserId',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/logout')
            .send(requestBody);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Token is required');
    });

    it('should return 401 if token is invalid', async () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        const response = await request(app)
            .post('/api/v1/admin/user/logout')
            .set('authorization', `Bearer invalidToken`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('jwt malformed');
    });

    it('should return 401 if unauthorized access', async () => {
        (jwt.verify as jest.Mock).mockResolvedValue({
            token: 'invalidToken',
        });
        (User.findById as jest.Mock).mockResolvedValue(null);

        const requestBody = {
            userId: 'mockUserId',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/logout')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });
});

describe('CHANGE PASSWORD', () => {
    beforeEach(() => jest.clearAllMocks());

    afterEach(() => jest.clearAllMocks());

    it('should return 200 if password is updated', async () => {
        (jwt.verify as jest.Mock).mockResolvedValue({ token: userToken });
        (User.findById as jest.Mock).mockResolvedValue({
            userId: 'mockUserId',
            save: jest.fn(),
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const requestBody = {
            userId: 'mockUserId',
            oldPassword: 'oldPassword123',
            newPassword: 'newPassword123!',
            confirmPassword: 'newPassword123!',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/password/change')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            'Password has been changed successfully',
        );
    });

    it('shoudl return 404 if user does not exist', async () => {
        (jwt.verify as jest.Mock).mockResolvedValue({ token: userToken });
        (User.findById as jest.Mock).mockResolvedValue(null);

        const requestBody = {
            userId: 'invalidUserId',
            oldPassword: 'oldPassword123',
            newPassword: 'newPassword123!',
            confirmPassword: 'newPassword123!',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/password/change')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });

    it('should return 406 if old password is invalid', async () => {
        (jwt.verify as jest.Mock).mockResolvedValue({ token: userToken });
        (User.findById as jest.Mock).mockResolvedValue({
            userId: 'mockUserId',
            save: jest.fn(),
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const requestBody = {
            userId: 'mockUserId',
            oldPassword: 'wrongOldPassword',
            newPassword: 'newPassword123!',
            confirmPassword: 'newPassword123!',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/password/change')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(406);
        expect(response.body.message).toBe('Invalid old password');
    });

    it('should return 406 if new password and confirm password do not match', async () => {
        (jwt.verify as jest.Mock).mockResolvedValue({ token: userToken });
        (User.findById as jest.Mock).mockResolvedValue({
            userId: 'mockUserId',
            save: jest.fn(),
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const requestBody = {
            userId: 'mockUserId',
            oldPassword: 'oldPassword123',
            newPassword: 'newPassword123!',
            confirmPassword: 'wrongConfirmPassword!',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/password/change')
            .send(requestBody)
            .set('authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(406);
        expect(response.body.message).toBe('Passwords do not match');
    });

    it('should return 401 if token is invalid', async () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        const requestBody = {
            userId: 'invalidUserId',
            oldPassword: 'oldPassword123',
            newPassword: 'newPassword123!',
            confirmPassword: 'newPassword123!',
        };

        const response = await request(app)
            .post('/api/v1/admin/user/password/change')
            .send(requestBody)
            .set('authorization', `Bearer invalidToken`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('jwt malformed');
    });
});

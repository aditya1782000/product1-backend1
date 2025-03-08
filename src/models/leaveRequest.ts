import mongoose, { Document, Model, Schema } from 'mongoose';
import data from '../../enum';

export interface ILeaveRequest extends Document {
    user: mongoose.Types.ObjectId;
    organization: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    leaveType: string;
    reason: string;
    status: string;
    approvedBy: mongoose.Types.ObjectId;
    rejectedBy: mongoose.Types.ObjectId;
    approvedAt: Date;
    rejectedAt: Date;
    rejectionReason: string;
}

export const LeaveRequestSchema: Schema<ILeaveRequest> =
    new Schema<ILeaveRequest>(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true,
            },
            organization: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'organisation',
                required: true,
            },
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
            leaveType: {
                type: String,
                required: true,
                enum: data.leaveType,
            },
            reason: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                required: true,
                enum: data.leaveStatus,
                default: 'pending',
            },
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
            rejectedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
            approvedAt: {
                type: Date,
            },
            rejectedAt: {
                type: Date,
            },
            rejectionReason: {
                type: String,
            },
        },
        { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
    );

const LeaveRequest: Model<ILeaveRequest> = mongoose.model<ILeaveRequest>(
    'leaveRequests',
    LeaveRequestSchema,
);

export default LeaveRequest;

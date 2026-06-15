import mongoose, { Document, Model, Schema } from 'mongoose';
import data from '../../enum';

export interface IAttendance extends Document {
    user: mongoose.Types.ObjectId;
    organization: mongoose.Types.ObjectId;
    date: Date;
    clockTimes: {
        inTime: Date;
        outTime?: Date;
        inLocation: string;
        outLocation?: string;
    }[];
    breaksStartTime: Date[];
    breakEndTime: Date[];
    totalWorkHours: number;
    totalBreakHours: number;
    status: string;
}

export const attendanceSchema: Schema<IAttendance> = new Schema<IAttendance>(
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
        date: {
            type: Date,
            required: true,
            default: new Date(),
        },
        clockTimes: [
            {
                inTime: { type: Date, required: true },
                outTime: { type: Date },
                inLocation: { type: String, required: true },
                outLocation: { type: String },
            },
        ],
        breaksStartTime: {
            type: [Date],
        },
        breakEndTime: {
            type: [Date],
        },
        totalWorkHours: {
            type: Number,
            default: 0,
        },
        totalBreakHours: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: data.attendanceStatus,
            default: 'present',
        },
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const Attendance: Model<IAttendance> = mongoose.model<IAttendance>(
    'attendances',
    attendanceSchema,
);

export default Attendance;

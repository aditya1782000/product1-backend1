import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import User from '../../models/user';
import Attendance from '../../models/attendance';
import dataTable from '../../utils/dataTable';
import { Request } from 'express';
import LeaveRequest from '../../models/leaveRequest';

export const clockInClockedOut = async (
    userId: string,
    location: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (user.role !== 'subAdmin') {
            return {
                statusCode: 403,
                success: false,
                message: 'Only subAdmins can clock in/out',
            };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentTime = new Date();
        const todayStart = new Date(currentTime);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(currentTime);
        todayEnd.setHours(23, 59, 59, 999);

        const approvedLeave = await LeaveRequest.findOne({
            user: userId,
            status: 'approved',
            leaveType: 'fullDay',
            startDate: { $lte: todayEnd },
            endDate: { $gte: todayStart },
        });

        if (approvedLeave) {
            return {
                statusCode: 403,
                success: false,
                message: 'You are already on leave',
            };
        }

        const existingAttendance = await Attendance.findOne({
            user: userId,
            organization: organisation,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
        });

        if (!existingAttendance) {
            const newAttendance = new Attendance({
                user: userId,
                organization: organisation,
                date: currentTime,
                clockTimes: [
                    {
                        inTime: currentTime,
                        inLocation: location,
                    },
                ],
                status: 'present',
            });

            await newAttendance.save();

            return {
                statusCode: 200,
                success: true,
                message: 'Clocked in successfully',
            };
        }

        const lastClockRecord =
            existingAttendance.clockTimes[
                existingAttendance.clockTimes.length - 1
            ];

        if (!lastClockRecord.outTime) {
            lastClockRecord.outTime = currentTime;
            lastClockRecord.outLocation = location;

            const sessionWorkHours =
                (currentTime.getTime() - lastClockRecord.inTime.getTime()) /
                (1000 * 60 * 60);

            existingAttendance.totalWorkHours += parseFloat(
                sessionWorkHours.toFixed(2),
            );

            if (existingAttendance.clockTimes.length > 1) {
                const previousSession =
                    existingAttendance.clockTimes[
                        existingAttendance.clockTimes.length - 2
                    ];
                const breakDuration =
                    (lastClockRecord.inTime.getTime() -
                        previousSession.outTime!.getTime()) /
                    (1000 * 60 * 60);
                existingAttendance.totalBreakHours += parseFloat(
                    breakDuration.toFixed(2),
                );

                if (previousSession.outTime) {
                    existingAttendance.breaksStartTime.push(
                        previousSession.outTime,
                    );
                }
                existingAttendance.breakEndTime.push(lastClockRecord.inTime);
            }
            await existingAttendance.save();
            return {
                statusCode: 200,
                success: true,
                message: 'Clocked out successfully',
            };
        } else {
            existingAttendance.clockTimes.push({
                inTime: currentTime,
                inLocation: location,
            });

            await existingAttendance.save();

            return {
                statusCode: 200,
                success: true,
                message: 'Clocked in successfully',
            };
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

export const listClockInClockOutTimes = async (
    userId: string,
    month: number,
    year: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        const adjustedMonth = month - 1;
        const startDate = new Date(year, adjustedMonth, 1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(year, adjustedMonth + 1, 1);
        endDate.setHours(0, 0, 0, 0);

        const attendanceRecords = await Attendance.find({
            user: userId,
            organization: organisation,
            date: { $gte: startDate, $lt: endDate },
        }).sort({ date: 1 });

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return {
                statusCode: 200,
                success: true,
                message: 'No attendance records found',
            };
        }

        const formattedRecords = attendanceRecords.map((record) => ({
            date: record.date.toISOString().split('T')[0],
            status: record.status,
            totalWorkHours: record.totalWorkHours,
            totalBreakHours: record.totalBreakHours,
            clockTimes: record.clockTimes.map((clock) => ({
                inTime: clock.inTime,
                inLocation: clock.inLocation,
                outTime: clock.outTime || null,
                outLocation: clock.outLocation || null,
            })),
            breaksStartTime: record.breaksStartTime || [],
            breakEndTime: record.breakEndTime || [],
        }));

        return {
            statusCode: 200,
            success: true,
            message: 'Attendance records fetched successfully',
            data: formattedRecords,
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

export const listSubAdminAttendanceSheet = async (
    userId: string,
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (user.role !== 'superAdmin') {
            return {
                statusCode: 403,
                success: false,
                message: 'Only superAdmins can see attendance sheets',
            };
        }

        const searchFields = ['firstName', 'lastName'];
        const oData = dataTable.initDataTable(req.body, searchFields, 'srNo');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let userQuery = {};
        if (oData.oSearchData.$or && oData.oSearchData.$or.length > 0) {
            userQuery = {
                $or: oData.oSearchData.$or.map(
                    (condition: { [key: string]: RegExp | number }) => {
                        const key = Object.keys(condition)[0];
                        return { [key]: condition[key] };
                    },
                ),
            };
        }

        const matchingUsers = await User.find(userQuery).select('_id');
        const userIds = matchingUsers.map((user) => user._id);

        const nRecordsTotal = await Attendance.countDocuments({
            date: { $gte: today, $lt: tomorrow },
            organization: organisation,
            user: { $in: userIds },
        });

        const attendanceRecords = await Attendance.find({
            date: { $gte: today, $lt: tomorrow },
            organization: organisation,
            user: { $in: userIds },
        })
            .populate('user', '_id firstName lastName phoneNumber')
            .select('date clockTimes totalWorkHours')
            .collation({ locale: 'en', strength: 1 })
            .sort(oData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Attendance records fetched successfully',
            data: attendanceRecords,
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

export const requestLeave = async (
    userId: string,
    startDate: Date,
    endDate: Date,
    leaveType: string,
    reason: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (user.role !== 'subAdmin') {
            return {
                statusCode: 403,
                success: false,
                message: 'Only subAdmins can request leave',
            };
        }

        if (new Date(startDate) > new Date(endDate)) {
            return {
                statusCode: 400,
                success: false,
                message: 'Start date cannot be after end date',
            };
        }

        const existingleave = await LeaveRequest.findOne({
            user: userId,
            organization: organisation,
            status: { $in: ['approved', 'pending'] },
            $or: [
                {
                    $and: [
                        {
                            startDate: { $lte: endDate },
                            endDate: { $gte: startDate },
                        },
                    ],
                },
            ],
        });

        if (existingleave) {
            return {
                statusCode: 400,
                success: false,
                message:
                    'You have already applied the leave for selected dates',
            };
        }

        if (
            startDate === endDate &&
            (leaveType === 'fullDay' || leaveType === 'firstHalf')
        ) {
            const today = new Date(startDate);
            today.setHours(0, 0, 0, 0);

            const existingAttendance = await Attendance.findOne({
                user: userId,
                organization: organisation,
                date: {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            });

            if (existingAttendance) {
                return {
                    statusCode: 400,
                    success: false,
                    message:
                        'You have already clocked in today. You can only apply for second half leave',
                };
            }
        }

        const newLeaveRequest = new LeaveRequest({
            user: userId,
            organization: organisation,
            startDate,
            endDate,
            leaveType,
            reason,
            status: 'pending',
        });

        await newLeaveRequest.save();

        return {
            statusCode: 201,
            success: true,
            message: 'Leave request submitted successfully',
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

export const listUserLeaveRequests = async (
    userId: string,
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        const searchFields = ['reason'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'srNo');

        const nRecordsTotal = await LeaveRequest.countDocuments({
            user: userId,
            organization: organisation,
        });

        const leaveRequests = await LeaveRequest.find({
            user: userId,
            organization: organisation,
        })
            .select(
                'reason startDate endDate status leaveType approvedAt rejectedAt rejectionReason',
            )
            .collation({ locale: 'en', strength: 1 })
            .sort(oData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Leave requests fetched successfully',
            data: leaveRequests,
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

export const listLeaveRequests = async (
    userId: string,
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (user.role !== 'superAdmin') {
            return {
                statusCode: 403,
                success: false,
                message: 'Only superAdmins can see leave requests',
            };
        }

        const searchFields = ['firstName'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'srNo');

        const nRecordsTotal = await LeaveRequest.countDocuments({
            status: 'pending',
            organization: organisation,
        });

        const leaveRequests = await LeaveRequest.find({
            status: 'pending',
            organization: organisation,
        })
            .populate('user', '_id firstName lastName phoneNumber')
            .select(
                'reason startDate endDate status leaveType approvedAt rejectedAt rejectionReason',
            )
            .collation({ locale: 'en', strength: 1 })
            .sort(oData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Leave requests fetched successfully',
            data: leaveRequests,
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

export const acceptRejectLeaveRequest = async (
    userId: string,
    requestId: string,
    action: string,
    organisation: mongoose.Types.ObjectId,
    rejectionReason?: string,
): Promise<AsyncResponseType> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (user.role !== 'superAdmin') {
            return {
                statusCode: 403,
                success: false,
                message: 'Only superAdmins can take actions',
            };
        }

        const leaveRequest = await LeaveRequest.findById(requestId);

        if (!leaveRequest) {
            return {
                statusCode: 404,
                success: false,
                message: 'Leave request not found',
            };
        }

        if (
            leaveRequest.organization &&
            leaveRequest.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        if (
            leaveRequest.status === 'approved' ||
            leaveRequest.status === 'rejected'
        ) {
            return {
                statusCode: 400,
                success: false,
                message: 'Leave request is already approved or rejected',
            };
        }

        if (action === 'approved') {
            leaveRequest.status = 'approved';
            leaveRequest.approvedAt = new Date();
            leaveRequest.approvedBy = user._id as mongoose.Types.ObjectId;
            await leaveRequest.save();

            return {
                statusCode: 200,
                success: true,
                message: 'Leave request approved successfully',
            };
        } else if (action === 'rejected') {
            leaveRequest.status = 'rejected';
            leaveRequest.rejectedAt = new Date();
            leaveRequest.rejectedBy = user._id as mongoose.Types.ObjectId;
            leaveRequest.rejectionReason = rejectionReason || '';
            await leaveRequest.save();

            return {
                statusCode: 200,
                success: true,
                message: 'Leave request rejected successfully',
            };
        }

        return {
            statusCode: 400,
            success: false,
            message: 'Invalid action. Must be "approved" or "rejected"',
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

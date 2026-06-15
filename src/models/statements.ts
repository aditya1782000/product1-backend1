import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStatementData extends Document {
    date: Date;
    direction: string;
    particulars: string;
    vchType: string;
    vchNo: string;
    debit?: number;
    credit?: number;
}

export interface IStatement extends Document {
    organizationName: string;
    organizationAddress: string;
    organization: mongoose.Types.ObjectId;
    statementData: IStatementData[];
}

const StatementDataSchema: Schema<IStatementData> = new Schema<IStatementData>({
    date: {
        type: Date,
        required: true,
    },
    direction: {
        type: String,
        required: true,
    },
    particulars: {
        type: String,
        required: true,
    },
    vchType: {
        type: String,
        // required: true,
    },
    vchNo: {
        type: String,
        // required: true,
    },
    debit: Number,
    credit: Number,
});

const StatementSchema: Schema<IStatement> = new Schema<IStatement>(
    {
        organizationName: {
            type: String,
            required: true,
        },
        organizationAddress: {
            type: String,
            required: true,
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'organisation',
        },
        statementData: [StatementDataSchema],
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const Statement: Model<IStatement> = mongoose.model(
    'statements',
    StatementSchema,
);

export default Statement;

import { Document, model, Model, Schema, Types } from "mongoose";
import Currency from "../../../core/static/Currency";
import { IWithdrawalTask, WithdrawalTaskSchema } from "../../administration/models/WithdrawalTask";
const Double = require('@mongoosejs/double');

const WithdrawalRequestSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    sum: {
        type: Double,
        min: 0,
        required: true
    },
    currency: {
        type: String,
        required: true,
        enum: Currency.getList()
    },
    wallet: {
        type: Types.ObjectId,
        ref: 'wallet',
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'user'
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization'
    },
    task: WithdrawalTaskSchema,
    satisfied: {
        type: Boolean,
        default: false
    },
    cryptowalletAddress: {
        type: String
    },
    transactionHash: {
        type: String
    },
    comment: {
        type: String,
        default: ''
    }
});

interface IWithdrawalRequestSchema extends Document {
    timestamp: Date;
    sum: number;
    currency: string;
    satisfied: boolean;
    task: IWithdrawalTask;
    cryptowalletAddress: string;
    transactionHash: string;
    comment: string;
};

interface IWithdrawalRequestBase extends IWithdrawalRequestSchema {

};

export interface IWithdrawalRequest extends IWithdrawalRequestBase {
    wallet: Types.ObjectId;
    user: Types.ObjectId;
    organization: Types.ObjectId;
};

export interface IWithdrawalRequestModel extends Model<IWithdrawalRequest> {

}

export const WithdrawalRequest = model<IWithdrawalRequest, IWithdrawalRequestModel>('withdrawalRequests', WithdrawalRequestSchema);
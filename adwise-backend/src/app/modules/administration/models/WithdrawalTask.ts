import { Document, model, Model, Schema } from "mongoose";
const Double = require('@mongoosejs/double');

export const WithdrawalTaskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    points: {
        type: Double,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

interface IWithdrawalTaskSchema extends Document {
    name: string;
    points: number;
    description: string;
    disabled: boolean;
};

interface IWithdrawalTaskBase extends IWithdrawalTaskSchema {

};

export interface IWithdrawalTask extends IWithdrawalTaskBase {

};

export interface IWithdrawalTaskModel extends Model<IWithdrawalTask> {

};

export const WithdrawalTaskModel = model<IWithdrawalTask, IWithdrawalTaskModel>('withdrawalTask', WithdrawalTaskSchema);
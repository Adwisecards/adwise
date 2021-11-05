import { Document, model, Model, Schema, Types } from "mongoose";
import BankRequestType from "../../../core/static/BankRequestType";

export const BankRequestSchema = new Schema({
    ref: {
        type: Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: BankRequestType.getList()
    },
    actionUrl: {
        type: String,
        default: ''
    },
    requestId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

interface IBankRequestSchema extends Document {
    requestId: string;
    type: string;
    actionUrl: string;
    timestamp: Date;
};

interface IBankRequestBase extends IBankRequestSchema {

};

export interface IBankRequest extends IBankRequestBase {
    ref: Types.ObjectId;
};

export interface IBankRequestModel extends Model<IBankRequest> {

};

export const BankRequestModel = model<IBankRequest, IBankRequestModel>('bankrequest', BankRequestSchema);
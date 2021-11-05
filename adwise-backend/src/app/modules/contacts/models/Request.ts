import { Document, model, Model, Schema, Types } from "mongoose";

const RequestSchema = new Schema({
    from: {
        type: Types.ObjectId,
        ref: 'contact',
        required: true
    },
    to: {
        type: Types.ObjectId,
        ref: 'contact',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

interface IRequestSchema extends Document {
    timestamp: Date;
};

export interface IRequestBase extends IRequestSchema {
    // Methods and virtuals
};

export interface IRequest extends IRequestBase {
    from: Types.ObjectId;
    to: Types.ObjectId;
};

export interface IRequestModel extends Model<IRequest> {};

export const RequestModel = model<IRequest, IRequestModel>('request', RequestSchema);
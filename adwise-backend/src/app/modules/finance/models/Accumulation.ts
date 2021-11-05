import { Document, model, Model, Schema, Types } from "mongoose";
import AccumulationType from "../../../core/static/AccumulationType";

export const AccumulationSchema = new Schema({
    accumulationId: {
        type: String,
        required: true
    },
    sum: {
        type: Number,
        required: true,
        set: (v: number) => Number(v.toFixed(2)) 
    },
    user: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    closed: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: AccumulationType.getList(),
        required: true
    },
    payments: [{
        type: Types.ObjectId,
        ref: 'payment' 
    }],
    timestamp: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        default: Date.now
    }
});

interface IAccumulationSchema extends Document {
    accumulationId: string;
    sum: number;
    type: string;
    closed: boolean;
    dueDate: Date;
    timestamp: Date;
};

interface IAccumulationBase extends IAccumulationSchema {

};

export interface IAccumulation extends IAccumulationBase {
    user: Types.ObjectId;
    payments: Types.ObjectId[];
};

export interface IAccumulationModel extends Model<IAccumulation> {

};

export const AccumulationModel = model<IAccumulation, IAccumulationModel>('accumulation', AccumulationSchema);
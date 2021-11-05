import { Document, model, Model, Schema, Types } from "mongoose";
import Gender from "../../../core/static/Gender";

export const ReceiverGroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parameters: {
        os: {
            type: String,
            enum: ['ios', 'android']
        },
        gender: {
            type: String,
            enum: Gender.getList()
        },
        ageFrom: {
            type: Number,
            min: 0
        },
        ageTo: {
            type: Number,
            min: 0
        },
        hasPurchase: {
            type: Boolean
        },
        organizations: [{
            type: Types.ObjectId
        }]
    },
    receivers: [{
        type: Types.ObjectId,
        ref: 'user'
    }],
    wantedReceivers: [{
        type: Types.ObjectId,
        ref: 'user'
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export interface IParameters {
    os: string;
    hasPurchase: boolean;
    organizations: Types.ObjectId[];
    gender: string;
    ageFrom: number;
    ageTo: number;
};

interface IReceiverGroupSchema extends Document {
    name: string;
    parameters: IParameters;
    timestamp: Date;
};

interface IReceiverGroupBase extends IReceiverGroupSchema {

};

export interface IReceiverGroup extends IReceiverGroupBase {
    receivers: Types.ObjectId[];
    wantedReceivers: Types.ObjectId[];
};

export interface IReceiverGroupModel extends Model<IReceiverGroup> {

};

export const ReceiverGroupModel = model<IReceiverGroup, IReceiverGroupModel>('receivergroup', ReceiverGroupSchema);
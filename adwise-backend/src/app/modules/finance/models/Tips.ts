import { boolean } from "joi";
import { Document, model, Model, Schema, Types } from "mongoose";

const TipsSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    sum: {
        type: Number,
        required: true
    },
    from: {
        type: Types.ObjectId,
        ref: 'user',
        required: false
    },
    to: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    processing: {
        type: Boolean,
        default: false
    },
    purchase: {
        type: Types.ObjectId,
        ref: 'purchase'
    }
});

interface ITipsSchema extends Document {
    timestamp: Date;
    sum: number;
    confirmed: boolean;
    processing: boolean;
};

interface ITipsBase extends ITipsSchema {

};

export interface ITips extends ITipsBase {
    from: Types.ObjectId;
    to: Types.ObjectId;
    organization: Types.ObjectId;
    purchase: Types.ObjectId;
};

export interface ITipsModel extends Model<ITips> {

};

export const TipsModel = model<ITips, ITipsModel>('tips', TipsSchema);
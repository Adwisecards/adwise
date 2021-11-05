import { Document, model, Model, Schema, Types } from "mongoose";

export const AdvantageSchema = new Schema({
    index: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: Types.ObjectId,
        ref: 'media',
        required: true
    }
});

interface IAdvantageSchema extends Document {
    index: number;
    name: number;
};

interface IAdvantageBase extends IAdvantageSchema {

};

export interface IAdvantage extends IAdvantageBase {
    picture: Types.ObjectId;

};

export interface IAdvantageModel extends Model<IAdvantage> {

};

export const AdvantageModel = model<IAdvantage, IAdvantageModel>('advantage', AdvantageSchema);
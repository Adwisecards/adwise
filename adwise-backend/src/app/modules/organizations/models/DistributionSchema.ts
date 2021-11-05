import { Document, model, Model, Schema } from "mongoose";
const Double = require('@mongoosejs/double');

export const DistributionSchema = new Schema({
    first: {
        type: Double,
        required: true,
        min: 0
    },
    other: {
        type: Double,
        required: true,
        min: 0
    }
});

interface IDistributionSchema extends Document{
    first: number;
    other: number;
};

interface IDistributionBase extends IDistributionSchema {

};

export interface IDistribution extends IDistributionBase {

};

export interface IDistributionModel extends Model<IDistribution> {

};

export const DistributionModel = model<IDistribution, IDistributionModel>('distribution', DistributionSchema);

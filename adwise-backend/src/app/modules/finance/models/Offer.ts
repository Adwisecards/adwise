import { Document, model, Model, Schema, Types } from "mongoose";
import Currency from "../../../core/static/Currency";
import OfferType from "../../../core/static/OfferType";
const Double = require('@mongoosejs/double');

export const OfferSchema = new Schema({
    type: {
        type: String,
        enum: OfferType.getList(),
        required: true
    },
    percent: {
        type: Number,
        min: 0,
        max: 100,
        required: function(this: IOfferSchema) {
            return this.type == 'cashback';
        }
    },
    currency: {
        type: String,
        enum: Currency.getList()
    },
    points: {
        type: Double,
        min: 0,
        set: (v: number) => v.toFixed(2),
        required: function(this: IOfferSchema) {
            return this.type == 'points'
        }
    },
    coupon: {
        type: Types.ObjectId,
        ref: 'coupon'
    }
});

interface IOfferSchema extends Document {
    type: string;
    percent: number;
    points: number;
};

interface IOfferBase extends IOfferSchema {

};

export interface IOffer extends IOfferBase {
    coupon: Types.ObjectId;
};

export interface IOfferModel extends Model<IOffer> {

};

export const OfferModel = model<IOffer, IOfferModel>('offer', OfferSchema);
import { Document, model, Model, Schema, Types } from "mongoose";
import Currency from "../../../core/static/Currency";
import PaymentType from "../../../core/static/PaymentType";
import { AccumulationSchema, IAccumulation } from "./Accumulation";
const Double = require('@mongoosejs/double');

const PaymentSchema = new Schema({
    type: {
        type: String,
        enum: PaymentType.getList(),
        required: true
    },
    ref: {
        type: Types.ObjectId
    },
    sum: {
        type: Double,
        required: true,
        min: 0,
        set: (v: number) => v.toFixed(2)
    },
    currency: {
        type: String,
        required: true,
        enum: Currency.getList()
    },
    paymentUrl: {
        type: String
    },
    paid: {
        type: Boolean,
        default: false
    },
    usedPoints: {
        type: Number,
        default: 0,
        set: (v: number) => v.toFixed(2)
    },
    cash: {
        type: Boolean,
        default: false
    },
    split: {
        type: Boolean,
        default: false
    },
    safe: {
        type: Boolean,
        default: false
    },
    accumulation: {
        type: Types.ObjectId,
        ref: 'accumulation'
    },
    paymentId: {
        type: String
    },
    confirmed: {
        type: Boolean
    },
    canceled: {
        type: Boolean,
        default: false
    }
});

interface IPaymentSchema extends Document {
    type: string;
    sum: number;
    currency: string;
    paymentUrl: string;
    paid: boolean;
    usedPoints: number;
    split: boolean;
    safe: boolean;
    cash: boolean;
    paymentId: string;
    confirmed: boolean;
    canceled: boolean;
};

interface IPaymentBase extends IPaymentSchema {

};

export interface IPayment extends IPaymentBase {
    ref: Types.ObjectId;
    accumulation: Types.ObjectId;
};

export interface IPaymentModel extends Model<IPayment> {

};

export const PaymentModel = model<IPayment, IPaymentModel>('payment', PaymentSchema);
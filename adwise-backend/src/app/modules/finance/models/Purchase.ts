import { boolean } from "joi";
import { Document, model, Model, Schema, Types } from "mongoose";
import Currency from "../../../core/static/Currency";
import { IRef, RefSchema } from "../../ref/models/Ref";
import { CouponSchema, ICoupon } from "../../organizations/models/Coupon";
const Double = require('@mongoosejs/double');
import PurchaseType from '../../../core/static/PurchaseType';
import { IOffer, OfferSchema } from "./Offer";

export const PurchaseSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    lastPaymentAt: {
        type: Date
    },
    paidAt: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    sharedAt: {
        type: Date
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    purchaser: {
        type: Types.ObjectId,
        ref: 'contact',
    },
    sumInPoints: {
        type: Double,
        min: 0,
        required: true,
        set: (v: number) => v.toFixed(2)
    },
    currency: {
        type: String,
        enum: Currency.getList(),
        required: true
    },
    description: {
        type: String,
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
    complete: {
        type: Boolean,
        default: false
    },
    canceled: {
        type: Boolean,
        default: false
    },
    cashier: {
        type: Types.ObjectId,
        ref: 'contact',
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'user',
    },
    ref: RefSchema,
    offers: {
        type: [OfferSchema],
        required: false
    },
    offer: {
        type: OfferSchema,
        required: false
    },
    coupons: [CouponSchema],
    coupon: {
        type: CouponSchema,
        required: false
    },
    marketingSum: {
        type: Double,
        min: 0,
        default: 0,
        set: (v: number) => Math.abs(v).toFixed(2),
        get: (v: number) => Number(Math.abs(v).toFixed(2))
    },
    transactions: [{
        type: Types.ObjectId,
        ref: 'transaction'
    }],
    payment: {
        type: Types.ObjectId,
        ref: 'payment',
        required: false
    },
    usedPoints: {
        type: Number,
        default: 0
    },
    disabled: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'cashless',
        enum: PurchaseType.getList()
    },
    comment: {
        type: String,
        default: ''
    },
    review: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    tips: {
        type: Boolean,
        default: false
    },
    shared: {
        type: Boolean
    },
    sharingContact: {
        type: Types.ObjectId
    },
    sharingUser: {
        type: Types.ObjectId
    },
    totalCashbackSum: {
        type: Number,
        min: 0
    },
    employeeRating: {
        type: Types.ObjectId,
        ref: 'employeerating'
    },
    archived: {
        type: Boolean,
        default: false
    }
}, {strict: false});

interface IPurchaseSchema extends Document {
    timestamp: Date;
    lastPaymentAt: Date;
    paidAt: Date;
    completedAt: Date;
    sharedAt: Date;
    sumInPoints: number;
    description: string;
    confirmed: boolean;
    processing: boolean;
    complete: boolean;
    canceled: boolean;
    currency: string;
    ref: IRef;
    marketingSum: number;
    offers: IOffer[];
    offer: IOffer;
    coupons: ICoupon[];
    coupon: ICoupon;
    disabled: boolean;
    type: string;
    comment: string;
    review: string;
    rating: number;
    tips: boolean;
    usedPoints: number;
    shared: boolean;
    totalCashbackSum: number;
    archived: boolean;
};

interface IPurchaseBase extends IPurchaseSchema {

};

export interface IPurchase extends IPurchaseBase {
    user: Types.ObjectId;
    organization: Types.ObjectId;
    cashier: Types.ObjectId;
    purchaser: Types.ObjectId;
    transactions: Types.ObjectId[];
    payment: Types.ObjectId;
    sharingUser: Types.ObjectId;
    sharingContact: Types.ObjectId;
    employeeRating: Types.ObjectId;
};

export interface IPurchaseModel extends Model<IPurchase> {

};

export const PurchaseModel = model<IPurchase, IPurchaseModel>('purchase', PurchaseSchema);
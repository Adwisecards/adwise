import { Document, model, Model, Schema, Types } from "mongoose";
import mongoose from 'mongoose';
import Currency from "../../../core/static/Currency";
import TransactionType from "../../../core/static/TransactionType";
import { CouponSchema, ICoupon } from "../../organizations/models/Coupon";
import { ISubscription, SubscriptionSchema } from './Subscription';
const Double = require('@mongoosejs/double');
let deepPopulate = require('mongoose-deep-populate')(mongoose);
import { IPurchase, PurchaseSchema } from './Purchase';
import { IOrganization, OrganizationSchema } from '../../organizations/models/Organization';
import { IUser, UserSchema } from '../../users/models/User';
import TransactionOrigin from "../../../core/static/TransactionOrigin";

export const TransactionSchema = new Schema({
    from: {
        type: Types.ObjectId,
        ref: 'wallet',
        index: true
    },
    to: {
        type: Types.ObjectId,
        ref: 'wallet',
        index: true
    },
    type: {
        type: String,
        required: true,
        index: true
    },
    currency: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    sum: {
        type: Double,
        min: 0,
        set: (v: number) => v.toFixed(2)
    },
    coupon: {
        type: CouponSchema,
        default: undefined
    },
    subscription: {
        type: SubscriptionSchema,
        default: undefined
    },
    purchase: {
        type: PurchaseSchema,
        default: undefined
    },
    organization: {
        type: OrganizationSchema,
        default: undefined
    },
    user: {
        type: UserSchema,
        default: undefined
    },
    context: {
        type: String,
        default: ''
    },
    complete: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    origin: {
        type: String,
        default: 'online',
        enum: TransactionOrigin.getList()
    },
    dueDate: {
        type: Date,
        default: Date.now
    },
    frozen: {
        type: Boolean,
        default: false
    },
    comment: {
        type: String,
        required: false
    }
});

TransactionSchema.plugin(deepPopulate, {});

interface ITransactionSchema extends Document {
    type: string;
    currency: string;
    timestamp: Date;
    sum: number;
    coupon: ICoupon;
    subscription: ISubscription;
    context: string;
    complete: boolean;
    purchase: IPurchase;
    organization: IOrganization;
    user: IUser;
    disabled: boolean;
    origin: string;
    dueDate: Date;
    frozen: boolean;
    comment: string;
};

interface ITransactionBase extends ITransactionSchema {};

export interface ITransaction extends ITransactionBase {
    from: Types.ObjectId;
    to: Types.ObjectId;
};

export interface ITransactionModel extends Model<ITransaction> {};

export const TransactionModel = model<ITransaction, ITransactionModel>('transaction', TransactionSchema);
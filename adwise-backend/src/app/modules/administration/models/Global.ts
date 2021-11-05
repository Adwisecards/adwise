import { Document, model, Model, Schema, Types } from "mongoose";
import { App } from "../../../App";
import Currency from "../../../core/static/Currency";
import { AppModel, AppSchema, IApp } from "./App";
import { DocumentSchema, IDocument } from "./Document";
import { IWithdrawalTask, WithdrawalTaskSchema } from "./WithdrawalTask";
const Double = require('@mongoosejs/double');

const GlobalSchema = new Schema({
    purchasePercent: {
        type: Double,
        default: 5
    },
    managerPercent: {
        type: Double,
        default: 0.25
    },
    managerPoints: {
        type: Double,
        default: 150
    },
    managerRefPercent: {
        type: Double,
        default: 1
    },
    currency: {
        type: String,
        enum: Currency.getList(),
        default: 'usd'
    },
    tasks: [WithdrawalTaskSchema],
    balanceUnfreezeTerms: {
        type: Number,
        min: 1,
        default: 14
    },
    contactEmail: {
        type: String,
        default: 'support@adwise.cards'
    },
    spareContactEmails: [{
        type: String,
        default: 'support@adwise.cards'
    }],
    technicalWorks: {
        type: Boolean,
        default: false
    },
    paymentShopId: {
        type: String,
        default: ''
    },
    tipsMinimalAmount: {
        type: Number,
        default: 30
    },
    minimalPayment: {
        type: Number,
        default: 100
    },
    maximumPayment: {
        type: Number,
        default: 5000
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization'
    },
    paymentGatewayPercent: {
        type: Number,
        default: 2.5
    },
    paymentGatewayMinimalFee: {
        type: Number,
        default: 3.49
    },
    paymentRetention: {
        type: Number,
        default: 7
    },
    app: {
        type: AppSchema,
        default: () => new AppModel()
    }
});

interface IGlobalSchema extends Document {
    purchasePercent: number;
    managerPercent: number;
    currency: string;
    managerPoints: number;
    managerRefPercent: number;
    tasks: IWithdrawalTask[];
    balanceUnfreezeTerms: number;
    contactEmail: string;
    spareContactEmails: string[];
    technicalWorks: boolean;
    paymentShopId: string;
    tipsMinimalAmount: number;
    minimalPayment: number;
    maximumPayment: number;
    paymentGatewayPercent: number;
    paymentGatewayMinimalFee: number;
    paymentRetention: number;
    app: IApp
};

interface IGlobalBase extends IGlobalSchema {

};

export interface IGlobal extends IGlobalBase {
    organization: Types.ObjectId;
};

export interface IGlobalModel extends Model<IGlobal> {

};

export const GlobalModel = model<IGlobal, IGlobalModel>('global', GlobalSchema);
import { Document, model, Model, Schema, Types } from "mongoose";
import { IPurchase, PurchaseSchema } from "../../finance/models/Purchase";
const Double = require('@mongoosejs/double');

const ClientSchema = new Schema({
    contact: {
        type: Types.ObjectId,
        ref: 'contact',
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    purchasesInOrganization: {
        type: Double,
        default: 0,
        min: 0,
        set: (v: number) => v.toFixed(2)
    },
    purchasesSum: {
        type: Double,
        default: 0,
        min: 0,
        set: (v: number) => v.toFixed(2)
    },
    refCount: {
        type: Double,
        default: 0,
        min: 0
    },
    bonusPoints: {
        type: Double,
        default: 0,
        min: 0,
        set: (v: number) => v.toFixed(2)
    },
    refPurchasesSum: {
        type: Double,
        default: 0,
        min: 0,
        set: (v: number) => v.toFixed(2)
    },
    disabled: {
        type: Boolean,
        default: false
    },
    stats: {
        updatedAt: {
            type: Date,
            default: Date.now
        },
        cashbackSum: {
            type: Number,
            default: 0
        },
        purchaseCount: {
            type: Number,
            default: 0
        },
        purchaseSum: {
            type: Number,
            default: 0
        },
        usedPointsSum: {
            type: Number,
            default: 0
        },
        purchases: {
            type: Array
        },
        subscriptionCount: {
            type: Number,
            default: 0
        },
        operations: [{
            type: {
                type: String,
                required: true
            },
            sum: {
                type: Number,
                required: false,
                min: 0
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            organizationName: {
                type: String,
                required: false
            },
            couponName: {
                type: String,
                required: false
            },
            bonusPoints: {
                type: Number,
                required: false
            },
            level: {
                type: String,
                required: false
            },
            refPoints: {
                type: Number,
                required: false
            }
        }]
    }
});

export interface IClientOperation {
    type: 'purchase' | 'marketing';
    sum: number;
    timestamp: Date;
    organizationName?: string;
    couponName?: string;

    bonusPoints?: number; // purchase
    level?: string; // marketing,
    refPoints?: number; // marketing
};

export interface IClientStats {
    updatedAt: Date;
    purchaseCount: number;
    purchaseSum: number;
    cashbackSum: number;
    usedPointsSum: number;
    purchases: any[];
    operations: IClientOperation[];
    subscriptionCount: number;
};

interface IClientSchema extends Document {
    purchasesInOrganization: number;
    purchasesSum: number;
    refCount: number;
    bonusPoints: number;
    refPurchasesSum: number;
    disabled: boolean;
    stats: IClientStats;
};

interface IClientBase extends IClientSchema {

};

export interface IClient extends IClientBase {
    user: Types.ObjectId;
    contact: Types.ObjectId;
    organization: Types.ObjectId;
};

export interface IClientModel extends Model<IClient> {

};

export const ClientModel = model<IClient, IClientModel>('client', ClientSchema);
import { Document, model, Model, Schema, Types } from "mongoose";

export const UserFinancialStatisticsSchema = new Schema({
    user: {
        type: Types.ObjectId,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    bonusSum: {
        type: Number,
        min: 0,
        default: 0,
        get: (v: number) => Number(v.toFixed(2)),
        set: (v: number) => Number(v.toFixed(2))
    },
    purchaseSum: {
        type: Number,
        min: 0,
        default: 0,
        get: (v: number) => Number(v.toFixed(2)),
        set: (v: number) => Number(v.toFixed(2))
    },
    refCount: {
        type: Number,
        min: 0,
        default: 0,
        get: (v: number) => Number(v.toFixed(2)),
        set: (v: number) => Number(v.toFixed(2))
    },
    marketingSum: {
        type: Number,
        min: 0,
        default: 0,
        get: (v: number) => Number(v.toFixed(2)),
        set: (v: number) => Number(v.toFixed(2))
    },
    usedPointsSum: {
        type: Number,
        min: 0,
        default: 0,
        get: (v: number) => Number(v.toFixed(2)),
        set: (v: number) => Number(v.toFixed(2))
    },
    withdrawalSum: {
        type: Number,
        min: 0,
        default: 0,
        get: (v: number) => Number(v.toFixed(2)),
        set: (v: number) => Number(v.toFixed(2))
    },
    managerPercentSum: {
        type: Number,
        min: 0,
        default: 0,
        get: (v: number) => Number(v.toFixed(2)),
        set: (v: number) => Number(v.toFixed(2))
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
    }],
    purchases: {
        type: Array       
    }
});

export interface IUserFinancialOperation {
    type: 'purchase' | 'marketing' | 'withdrawal' | 'usedPoints';
    sum: number;
    timestamp: Date;
    organizationName?: string;
    couponName?: string;

    bonusPoints?: number; // purchase
    level?: string; // marketing,
    refPoints?: number; // marketing
};

interface IUserFinancialStatisticsSchema extends Document {
    timestamp: Date;
    updatedAt: Date;
    bonusSum: number;
    purchaseSum: number;
    refCount: number;
    marketingSum: number;
    usedPointsSum: number;
    withdrawalSum: number;
    managerPercentSum: number;
    operations: IUserFinancialOperation[];
    purchases: any[];
};

interface IUserFinancialStatisticsBase extends IUserFinancialStatisticsSchema {

};

export interface IUserFinancialStatistics extends IUserFinancialStatisticsBase {
    user: Types.ObjectId;
};

export interface IUserFinancialStatisticsModel extends Model<IUserFinancialStatistics> {

};

export const UserFinancialStatisticsModel = model<IUserFinancialStatistics, IUserFinancialStatisticsModel>('userfinancialstatistics', UserFinancialStatisticsSchema);
import { number } from "joi";
import { Document, model, Model, Schema, Types } from "mongoose";
import { IOrganization, OrganizationModel } from "./Organization";
const Double = require('@mongoosejs/double');

const OrganizationStatisticsSchema = new Schema({
    organization: {
        type: Types.ObjectId,
        ref: 'organization'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    onlinePurchaseCount: {
        type: Double,
        default: 0.00
    },
    cashPurchaseCount: {
        type: Double,
        default: 0.00
    },
    onlineCashbackSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    cashCashbackSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    onlineMarketingSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    cashMarketingSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    onlinePaymentGatewaySum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    cashPaymentGatewaySum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
 
    },
    onlinePurchaseSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    cashPurchaseSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    onlineProfitSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    cashProfitSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    withdrawnSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    depositPayoutSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    paidToBankAccountSum: {
        type: Double,
        set: (v: number) => Number(v.toFixed(2)),
        default: 0.00
    },
    operations: [{
        type: {
            type: String,
            required: true,
            enum: ['purchase', 'deposit', 'withdrawal']
        },
        sum: {
            type: Double,
            required: true
        },
        timestamp: {
            type: Date,
            required: true
        },
        cashback: {
            type: Double
        },
        adwisePoints: {
            type: Double
        },
        managerPoints: {
            type: Double
        },
        firstLevel: {
            type: Double
        },
        otherLevels: {
            type: Double
        }
    }]
});

export interface IOrganizationStatisticsOperation {
    type: 'purchase' | 'deposit' | 'withdrawal';
    sum: number;
    timestamp: Date;

    cashback?: number;
    adwisePoints?: number;
    managerPoints?: number;
    firstLevel?: number;
    otherLevels?: number;
};

interface IOrganizationStatisticsSchema extends Document {
    updatedAt: Date;
    timestamp: Date;
    onlinePurchaseCount: number;
    cashPurchaseCount: number;
    onlineCashbackSum: number;
    cashCashbackSum: number;
    onlineMarketingSum: number;
    cashMarketingSum: number;
    onlinePurchaseSum: number;
    cashPurchaseSum: number;
    onlinePaymentGatewaySum: number;
    cashPaymentGatewaySum: number;
    onlineProfitSum: number;
    cashProfitSum: number;
    withdrawnSum: number;
    depositPayoutSum: number;
    paidToBankAccountSum: number;
    operations: IOrganizationStatisticsOperation[];
};

interface IOrganizationStatisticsBase extends IOrganizationStatisticsSchema {

};

export interface IOrganizationStatistics extends IOrganizationStatisticsBase {
    organization: IOrganization;
};

export interface IOrganizationStatisticsModel extends Model<IOrganizationStatistics> {

};

export const OrganizationStatisticsModel = model<IOrganizationStatistics, IOrganizationStatisticsModel>('organizationstatistics', OrganizationStatisticsSchema);
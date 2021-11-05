import { Document, model, Model, Schema, Types } from "mongoose";
import Currency from "../../../core/static/Currency";
import PointType from "../../../core/static/PointType";
const Double = require('@mongoosejs/double');

const WalletSchema = new Schema({
    currency: {
        type: String,
        required: true,
        enum: Currency.getList()
    },
    points: {
        type: Double,
        default: 0,
        set: (v: number) => v.toFixed(2)
    },
    cashbackPoints: {
        type: Double,
        default: 0,
        set: (v: number) => v.toFixed(2)
    },
    bonusPoints: {
        type: Double,
        default: 0,
        set: (v: number) => v.toFixed(2)
    },
    frozenPoints: [{
        sum: {
            type: Double,
            min: 0,
            set: (v: number) => v.toFixed(2)
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: PointType.getList(),
            required: false
        }
    }],
    frozenPointsSum: {
        type: Number,
        default: 0,
        set: (v: number) => v.toFixed(2)
    },
    user: {
        type: Types.ObjectId,
        ref: 'user'
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization'
    },
    new: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deposit: {
        type: Number,
        default: 0,
        set: (v: number) => v.toFixed(2)
    }
});

WalletSchema.pre('find', function(this: IWallet, next) {
    if (!this.new && !this.organization) {
        this.bonusPoints = this.points;
        this.points = 0;
    }

    if (!this.new) {
        const frozenPointsSum = this.frozenPoints?.reduce((sum, cur) => sum += cur.sum, 0) || 0;
        if (this.organization) {
            this.points += frozenPointsSum;
        } else {
            this.bonusPoints += frozenPointsSum;
        }

        this.frozenPoints = [];
    }

    next();
});

WalletSchema.pre('save', function(this: IWallet, next) {
    if (!this.new) {
        const frozenPointsSum = this.frozenPoints?.reduce((sum, cur) => sum += cur.sum, 0) || 0;
        if (this.organization) {
            this.points += frozenPointsSum;
        } else {
            this.bonusPoints += frozenPointsSum;
        }
        
        this.frozenPoints = [];
    }


    next();
});

interface IWalletSchema extends Document {
    currency: string;
    points: number;
    frozenPoints: {
        sum: number;
        timestamp: Date;
        type: string;
    }[];
    cashbackPoints: number;
    bonusPoints: number;
    new: boolean;
    updatedAt: Date;
    deposit: number;
    frozenPointsSum: number;
};

interface IWalletBase extends IWalletSchema {

};

export interface IWallet extends IWalletBase {
    user: Types.ObjectId;
    organization: Types.ObjectId;
};

export interface IWalletModel extends Model<IWallet> {

};

export const WalletModel = model<IWallet, IWalletModel>('wallet', WalletSchema);
import { boolean } from "joi";
import { Document, model, Model, Schema, Types } from "mongoose";
import AgeRestricted from "../../../core/static/AgeRestricted";
import CouponType from "../../../core/static/CouponType";
import { IAddress } from "../../maps/models/Address";
import { IRef, RefSchema } from "../../ref/models/Ref";
import { CouponCategorySchema } from "./CouponCategory";
import { IDistribution, DistributionSchema } from "./DistributionSchema";
const Double = require('@mongoosejs/double');

export const CouponSchema = new Schema({
    organizationPicture: {
        type: String,
    },
    organizationBriefDescription: {
        type: String,
        required: true
    },
    organizationName: {
        type: String,
        required: true
    },
    organizationCategory: {
        type: String,
        required: true
    },
    offer: {
        type: Types.ObjectId,
        ref: 'offer',
        required: true
    },
    purchaseSum: {
        type: Double,
        min: 0,
        default: 0,
        set: (v: number) => Math.abs(v).toFixed(2),
        get: (v: number) => Number(Math.abs(v).toFixed(2))
    },
    marketingSum: {
        type: Double,
        min: 0,
        default: 0,
        set: (v: number) => Math.abs(v).toFixed(2),
        get: (v: number) => Number(Math.abs(v).toFixed(2))
    },
    offerSum: {
        type: Double,
        min: 0,
        default: 0,
        set: (v: number) => Math.abs(v).toFixed(2),
        get: (v: number) => Number(Math.abs(v).toFixed(2))
    },
    organizationSum: {
        type: Double,
        min: 0,
        default: 0,
        set: (v: number) => Math.abs(v).toFixed(2),
        get: (v: number) => Number(Math.abs(v).toFixed(2))
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: ''
        //required: true
    },
    pictureMedia: {
        type: Types.ObjectId,
        ref: 'media'
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    quantity: {
        type: Number,
        min: 0,
        required: true
    },
    initialQuantity: {
        type: Number,
        min: 0
    },
    ref: {
        type: RefSchema,
        required: false
    },
    distributionSchema: DistributionSchema,
    disabled: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    document: {
        type: String,
        required: false
    },
    documentMedia: {
        type: Types.ObjectId,
        ref: 'media'
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    paid: {
        type: Boolean
    },
    location: {
        type: Schema.Types.Mixed,
        get: function(v: any) {
            console.log(v);
            if (typeof v == 'string') {
                return undefined;
            } else {
                return v;
            }
        },
        set: function(v: any) {
            console.log(v);
            if (typeof v == 'string') {
                return undefined;
            } else {
                return v;
            }
        }
    },
    termsDocument: {
        type: String,
        required: false
    },
    termsDocumentMedia: {
        type: Types.ObjectId,
        ref: 'media'
    },
    index: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: 'service',
        enum: CouponType.getList()
    },
    ageRestricted: {
        type: String,
        enum: AgeRestricted.getList()
    },
    categories: [{
        type: Types.ObjectId,
        ref: 'couponcategory',
        required: false
    }],
    floating: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {strict: false});

interface ICouponSchema extends Document {
    organizationPicture: string;
    organizationBriefDescription: string;
    organizationName: string;
    organizationCategory: string;
    name: string;
    description: string;
    picture: string;
    quantity: number;
    initialQuantity: number;
    ref: IRef;
    distributionSchema: IDistribution;
    disabled: boolean;
    purchaseSum: number;
    marketingSum: number;
    offerSum: number;
    organizationSum: number;
    startDate: Date;
    endDate: Date;
    document: string;
    price: number;
    used: boolean;
    location: IAddress;
    termsDocument: string;
    index: string;
    type: string;
    ageRestricted: string;
    floating: boolean;
    updatedAt: Date;
};

interface ICouponBase extends ICouponSchema {

};

export interface ICoupon extends ICouponBase {
    organization: Types.ObjectId;
    offer: Types.ObjectId;
    pictureMedia: Types.ObjectId;
    documentMedia: Types.ObjectId;
    termsDocumentMedia: Types.ObjectId;
    categories: Types.ObjectId[];
};

export interface ICouponModel extends Model<ICoupon> {

};

export const CouponModel = model<ICoupon, ICouponModel>('coupon', CouponSchema);
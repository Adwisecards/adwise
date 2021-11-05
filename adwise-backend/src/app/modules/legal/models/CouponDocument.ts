import { Document, model, Model, Schema, Types } from "mongoose";
import CouponDocumentType from "../../../core/static/CouponDocumentType";

export const CouponDocumentSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: CouponDocumentType.getList()
    },
    documentMedia: {
        type: Types.ObjectId,
        ref: 'coupon',
        required: true
    },
    coupon: {
        type: Types.ObjectId,
        ref: 'coupon',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

interface ICouponDocumentSchema extends Document {
    type: string;
    timestamp: Date;
    updatedAt: Date;
};

interface ICouponDocumentBase extends ICouponDocumentSchema {

};

export interface ICouponDocument extends ICouponDocumentBase {
    documentMedia: Types.ObjectId;
    coupon: Types.ObjectId;
};

export interface ICouponDocumentModel extends Model<ICouponDocument> {

};

export const CouponDocumentModel = model<ICouponDocument, ICouponDocumentModel>('coupondocument', CouponDocumentSchema);
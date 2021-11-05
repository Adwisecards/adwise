import { Document, model, Model, Schema, Types } from "mongoose";
import { IOrganization } from "./Organization";

export const CouponCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        set: (v: string) => v.toLowerCase()
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

interface ICouponCategorySchema extends Document {
    name: string;
    disabled: boolean;
};

interface ICouponCategoryBase extends ICouponCategorySchema {

};

export interface ICouponCategory extends ICouponCategoryBase {
    organization: IOrganization;
};

export interface ICouponCategoryModel extends Model<ICouponCategory> {

};

export const CouponCategoryModel = model<ICouponCategory, ICouponCategoryModel>('couponcategory', CouponCategorySchema);
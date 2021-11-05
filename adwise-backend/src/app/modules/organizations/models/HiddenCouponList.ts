import { Document, model, Model, Schema, Types } from "mongoose";

export const HiddenCouponListSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user'
    },
    coupons: [{
        type: Types.ObjectId,
        ref: 'coupon'
    }]
});

interface IHiddenCouponListSchema extends Document {

};

interface IHiddenCouponListBase extends IHiddenCouponListSchema {

};

export interface IHiddenCouponList extends IHiddenCouponListBase {
    user: Types.ObjectId;
    coupons: Types.ObjectId[];
};

export interface IHiddenCouponListModel extends Model<IHiddenCouponList> {

};

export const HiddenCouponListModel = model<IHiddenCouponList, IHiddenCouponListModel>('hiddencouponlist', HiddenCouponListSchema);
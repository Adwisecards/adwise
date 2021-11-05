import { Document, model, Model, Schema, Types } from "mongoose";

export const FavoriteCouponListSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user'
    },
    coupons: [{
        type: Types.ObjectId,
        ref: 'coupon'
    }]
});

interface IFavoriteCouponListSchema extends Document {

};

interface IFavoriteCouponListBase extends IFavoriteCouponListSchema {

};

export interface IFavoriteCouponList extends IFavoriteCouponListBase {
    user: Types.ObjectId;
    coupons: Types.ObjectId[];
};

export interface IFavoriteCouponListModel extends Model<IFavoriteCouponList> {

};

export const FavoriteCouponListModel = model<IFavoriteCouponList, IFavoriteCouponListModel>('favoritecouponlist', FavoriteCouponListSchema);
import { Document, model, Model, Schema, Types } from "mongoose";
import Currency from "../../../core/static/Currency";
import ProductType from "../../../core/static/ProductType";
import { IRef, RefSchema } from "../../ref/models/Ref";
const Double = require('@mongoosejs/double');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Double,
        min: 0,
        required: true,
        set: (v: number) => v.toFixed(2)
    },
    currency: {
        type: String,
        required: true,
        enum: Currency.getList()
    },
    picture: {
        type: String
    },
    disabled: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ref: RefSchema,
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ProductType.getList()
    },
    code: {
        type: String,
        required: true
    }
});

interface IProductSchema extends Document {
    name: string;
    description: string;
    price: number;
    currency: string;
    picture: string;
    disabled: boolean;
    timestamp: Date;
    ref: IRef;
    type: string;
    code: string;
};

export interface IProductBase extends IProductSchema {

};

export interface IProduct extends IProductBase {
    organization: Types.ObjectId;
};

export interface IProductModel extends Model<IProduct> {};

export const ProductModel = model<IProduct, IProductModel>('product', ProductSchema);
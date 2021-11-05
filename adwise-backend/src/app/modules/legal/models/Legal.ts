import { required } from "joi";
import { Document, model, Model, Schema, Types } from "mongoose";
import Country from "../../../core/static/Country";
import CountryLegalForm from "../../../core/static/CountryLegalForm";
import { IpLegalInfoSchema, IIpLegalInfo } from "./legalInfo/IpLegalInfo";
import { IndividualLegalInfoSchema, IIndividualLegalInfo } from "./legalInfo/IndividualLegalInfo";
import { OOOLegalInfoSchema, IOOOLegalInfo } from "./legalInfo/OOOLegalInfo";

export const legalInfoSchema = new Schema({
    ...IpLegalInfoSchema,
    ...IndividualLegalInfoSchema,
    ...OOOLegalInfoSchema
});

export const LegalSchema = new Schema({
    organization: {
        type: Types.ObjectId,
        ref: 'organization'
    },
    country: {
        type: String,
        required: true,
        enum: Country.getList()
    },
    form: {
        type: String,
        required: true,
        validate: {
            validator: function (this: ILegalSchema, v: string) {
                return !!CountryLegalForm.getList(this.country)?.find(f => f == v);
            },
            message: 'Form should be legitimate in the country'
        }
    },
    info: {
        type: legalInfoSchema,
        required: true
    },
    relevant: {
        type: Boolean,
        default: false
    },
    paymentShopId: {
        type: String,
        required: false
    }
});

interface ILegalSchema extends Document {
    country: string;
    form: string;
    info: IIpLegalInfo | IIndividualLegalInfo | IOOOLegalInfo;
    relevant: boolean;
    paymentShopId: string;
};

interface ILegalBase extends ILegalSchema {

};

export interface ILegal extends ILegalBase {
    organization: Types.ObjectId;
};

export interface ILegalModel extends Model<ILegal> {

};

export const LegalModel = model<ILegal, ILegalModel>('legal', LegalSchema);
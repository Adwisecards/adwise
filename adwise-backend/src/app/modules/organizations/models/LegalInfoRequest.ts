import { Document, model, Model, Schema, Types } from "mongoose";
import Country from "../../../core/static/Country";
import { ILegal, LegalSchema } from "../../legal/models/Legal";
import { AddressSchema, IAddress } from "../../maps/models/Address";
import { CategorySchema, ICategory } from "./Category";
import { IOrganization } from "./Organization";

export const LegalInfoRequestSchema = new Schema({
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    address: AddressSchema,
    category: CategorySchema,
    emails: [{
        type: String
    }],
    phones: [{
        type: String
    }],
    legal: LegalSchema,
    previousLegal: LegalSchema,
    satisfied: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean
    },
    rejectionReason: {
        type: String
    },
    comment: {
        type: String,
        required: true
    }
});

interface ILegalInfoRequestSchema extends Document {
    timestamp: Date;
    name: string;
    address: IAddress;
    category: ICategory;
    emails: string[];
    phones: string[];
    satisfied: boolean;
    rejected: boolean;
    rejectionReason: string;
    comment: string;
    legal: ILegal;
    previousLegal: ILegal;
};

interface ILegalInfoRequestBase extends ILegalInfoRequestSchema {

};

export interface ILegalInfoRequest extends ILegalInfoRequestBase {
    organization: Types.ObjectId;
};

export interface ILegalInfoRequestModel extends Model<ILegalInfoRequest> {

};

export const LegalInfoRequestModel = model<ILegalInfoRequest, ILegalInfoRequestModel>('legalinforequest', LegalInfoRequestSchema);
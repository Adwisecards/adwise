import { Document, model, Model, Schema, Types } from "mongoose";
import OrganizationDocumentType from "../../../core/static/OrganizationDocumentType";

export const OrganizationDocumentSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: OrganizationDocumentType.getList()
    },
    documentMedia: {
        type: Types.ObjectId,
        ref: 'media',
        required: true
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    options: {
        dateFrom: {
            type: Date
        },
        dateTo: {
            type: Date
        }
    }
});

interface IOrganizationDocumentSchema extends Document {
    type: string;
    timestamp: Date;
    updatedAt: Date;
    options: {
        dateFrom: Date;
        dateTo: Date;
    };
};

interface IOrganizationDocumentBase extends IOrganizationDocumentSchema {

};

export interface IOrganizationDocument extends IOrganizationDocumentBase {
    documentMedia: Types.ObjectId;
    organization: Types.ObjectId;
};

export interface IOrganizationDocumentModel extends Model<IOrganizationDocument> {

};

export const OrganizationDocumentModel = model<IOrganizationDocument, IOrganizationDocumentModel>('organizationdocument', OrganizationDocumentSchema);
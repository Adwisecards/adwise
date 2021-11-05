import { Document, model, Model, Schema, Types } from "mongoose";
import UserDocumentType from "../../../core/static/UserDocumentType";

export const UserDocumentSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: UserDocumentType.getList()
    },
    documentMedia: {
        type: Types.ObjectId,
        ref: 'media',
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'user',
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

interface IUserDocumentSchema extends Document {
    type: string;
    timestamp: Date;
    updatedAt: Date;
};

interface IUserDocumentBase extends IUserDocumentSchema {

};

export interface IUserDocument extends IUserDocumentBase {
    documentMedia: Types.ObjectId;
    user: Types.ObjectId;
};

export interface IUserDocumentModel extends Model<IUserDocument> {

};

export const UserDocumentModel = model<IUserDocument, IUserDocumentModel>('userdocument', UserDocumentSchema);
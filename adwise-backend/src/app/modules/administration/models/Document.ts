import { Document, model, Model, Schema, Types } from "mongoose";
import DocumentType from "../../../core/static/DocumentType";

export const DocumentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    file: {
        type: Types.ObjectId,
        ref: 'media',
        required: true
    },
    index: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        required: true,
        enum: DocumentType.getList()
    }
});

interface IDocumentSchema extends Document {
    name: string;
    description: string;
    index: number;
    type: string;
};

interface IDocumentBase extends IDocumentSchema {

};

export interface IDocument extends IDocumentBase {
    file: Types.ObjectId;
};

export interface IDocumentModel extends Model<IDocument> {

};

export const DocumentModel = model<IDocument, IDocumentModel>('document', DocumentSchema);
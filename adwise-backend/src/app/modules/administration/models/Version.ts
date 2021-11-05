import { Document, model, Model, Schema } from "mongoose";
import VersionType from "../../../core/static/VersionType";

export const VersionSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: VersionType.getList()
    },
    title: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});

interface IVersionSchema extends Document {
    type: string;
    title: string;
    version: string;
    date: Date;
    comment: string;
};

interface IVersionBase extends IVersionSchema {

};

export interface IVersion extends IVersionBase {

};

export interface IVersionModel extends Model<IVersion> {

};

export const VersionModel = model<IVersion, IVersionModel>('version', VersionSchema);
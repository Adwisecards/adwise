import { Document, model, Model, Schema } from "mongoose";

const DbSaveErrorSchema = new Schema({
    object: Object,
    error: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

interface IDbSaveErrorSchema extends Document {
    error: string;
    timestamp: Date;
    object: any;
};

interface IDbSaveErrorBase extends IDbSaveErrorSchema {

};

export interface IDbSaveError extends IDbSaveErrorBase {

};

export interface IDbSaveErrorModel extends Model<IDbSaveError> {

};

export const DbSaveErrorModel = model<IDbSaveError, IDbSaveErrorModel>('dbsaveerror', DbSaveErrorSchema);
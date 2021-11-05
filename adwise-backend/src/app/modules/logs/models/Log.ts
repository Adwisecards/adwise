import { Document, model, Model, Schema, Types } from "mongoose";
import LogApp from "../../../core/static/LogApp";
import LogPlatform from "../../../core/static/LogPlatform";

const LogSchema = new Schema({
    platform: {
        type: String,
        required: true,
        enum: LogPlatform.getList()
    },
    app: {
        type: String,
        requred: true,
        enum: LogApp.getList()
    },
    event: {
        type: String,
        required: true
    },
    isError: {
        type: Boolean,
        default: false
    },
    meta: {
        type: Object,
        default: {}
    },
    user: {
        type: Types.ObjectId,
        ref: 'user'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
        default: ''
    }
});

interface ILogSchema extends Document {
    platform: string;
    app: string;
    event: string;
    isError: boolean;
    meta: {[key: string]: any};
    timestamp: Date;
    message: string;
};

interface ILogBase extends ILogSchema {

};

export interface ILog extends ILogBase {
    user: Types.ObjectId;
};

export interface ILogModel extends Model<ILog> {

};

export const LogModel = model<ILog, ILogModel>('log', LogSchema);
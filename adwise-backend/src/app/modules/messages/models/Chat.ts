import { Document, model, Model, Schema, Types } from "mongoose";
import ChatType from "../../../core/static/ChatType";
import { IRef, RefSchema } from "../../ref/models/Ref";

export const ChatSchema = new Schema({
    type: {
        type: String,
        enum: ChatType.getList(),
        required: true
    },
    from: {
        type: {
            type: String,
            enum: ChatType.getList(),
            required: true
        },
        ref: {
            type: Types.ObjectId,
            required: true
        }
    },
    to: {
        type: {
            type: String,
            enum: ChatType.getList(),
            required: true
        },
        ref: {
            type: Types.ObjectId,
            required: true
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ref: RefSchema
});

interface IChatSchema extends Document {
    type: string;
    timestamp: Date;
    ref: IRef
};

interface IChatBase extends IChatSchema {

};

export interface IChat extends IChatBase {
    from: {
        type: string;
        ref: Types.ObjectId;
    };
    to: {
        type: string;
        ref: Types.ObjectId;
    };
};

export interface IChatModel extends Model<IChat> {

};

export const ChatModel = model<IChat, IChatModel>('chat', ChatSchema);
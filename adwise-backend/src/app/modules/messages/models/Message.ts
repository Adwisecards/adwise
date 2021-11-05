import { Document, model, Model, Schema, Types } from "mongoose";
import ChatType from "../../../core/static/ChatType";

export const MessageSchema = new Schema({
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
    body: {
        text: {
            type: String,
            default: ''
        },
        media: [{
            type: String
        }]
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean,
        default: false
    },
    context: {
        type: String,
        required: true
    }
});

interface IMessageSchema extends Document {
    body: {
        text: string;
        media: string[]
    },
    timestamp: Date;
    seen: boolean;
    context: string;
};

interface IMessageBase extends IMessageSchema {

};

export interface IMessage extends IMessageBase {
    from: {
        type: string;
        ref: Types.ObjectId;
    };
    to: {
        type: string;
        ref: Types.ObjectId;
    };
};

export interface IMessageModel extends Model<IMessage> {

};

export const MessageModel = model<IMessage, IMessageModel>('message', MessageSchema);
import { Document, model, Model, Schema, Types } from "mongoose";
import UserNotificationLevel from "../../../core/static/UserNotificationLevel";
import UserNotificationType from "../../../core/static/UserNotificationType";

export const UserNotificationSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    purchase: {
        type: Types.ObjectId,
        ref: 'purchase'
    },
    contact: {
        type: Types.ObjectId,
        ref: 'contact'
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization'
    },
    type: {
        type: String,
        required: true,
        enum: UserNotificationType.getList()
    },
    level: {
        type: String,
        required: true,
        enum: UserNotificationLevel.getList()
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean,
        default: false
    }
});

interface IUserNotificationSchema extends Document {
    type: string;
    level: string;
    timestamp: Date;
    seen: Boolean;
};

interface IUserNotificationBase extends IUserNotificationSchema {

};

export interface IUserNotification extends IUserNotificationBase {
    user: Types.ObjectId;
    purchase: Types.ObjectId;
    contact: Types.ObjectId;
    organization: Types.ObjectId;
};

export interface IUserNotificationModel extends Model<IUserNotification> {

};

export const UserNotificationModel = model<IUserNotification, IUserNotificationModel>('usernotification', UserNotificationSchema);
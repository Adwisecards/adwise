import { Document, model, Model, Schema, Types } from "mongoose";
import NotificationType from "../../../core/static/NotificationType";
import { NotificationType as TypeNotificationType } from '../../../services/notificationService/INotificationService';

export const NotificationSchema = new Schema({
    organization: {
        type: Types.ObjectId,
        ref: 'organization'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        required: true,
        enum: NotificationType.getList()
    },
    title: {
        type: String,
        required: false
    },
    body: {
        type: String,
        required: false
    },
    data: {
        type: Object,
        default: {}
    },
    receiverGroup: {
        type: Types.ObjectId,
        ref: 'receivergroup'
    },
    receivers: [{
        type: Types.ObjectId,
        ref: 'user'
    }]
});

interface INotificationSchema extends Document {
    timestamp: Date;
    title: string;
    body: string;
    data: {[key: string]: any};
    type: TypeNotificationType;
};

interface INotificationBase extends INotificationSchema {

};

export interface INotification extends INotificationBase {
    organization: Types.ObjectId;
    receiverGroup: Types.ObjectId;
    receivers: Types.ObjectId[];
};

export interface INotificationModel extends Model<INotification> {

};

export const NotificationModel = model<INotification, INotificationModel>('notification', NotificationSchema);
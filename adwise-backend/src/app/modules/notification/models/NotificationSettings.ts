import { Document, model, Model, Schema, Types } from "mongoose";
import { IUser } from "../../users/models/User";

export const NotificationSettingsSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    restrictedOrganizations: [{
        type: Types.ObjectId,
        ref: 'organization'  
    }],
    coupon: {
        type: Boolean,
        default: true
    },
    contact: {
        type: Boolean,
        default: true
    },
    ref: {
        type: Boolean,
        default: true
    },
    task: {
        type: Boolean,
        default: true
    }
});

interface INotificationSettingsSchema extends Document {
    coupon: boolean;
    contact: boolean;
    ref: boolean;
    task: boolean;
};

interface INotificationSettingsBase extends INotificationSettingsSchema {

};

export interface INotificationSettings extends INotificationSettingsBase {
    user: Types.ObjectId;
    restrictedOrganizations: Types.ObjectId[];
}

export interface INotificationSettingsModel extends Model<INotificationSettings> {

};

export const NotificationSettingsModel = model<INotificationSettings, INotificationSettingsModel>('notificationsettings', NotificationSettingsSchema);
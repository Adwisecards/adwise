import { Document, model, Model, Schema, Types } from "mongoose";
import OrganizationNotificationType from "../../../core/static/OrganizationNotificationType";

export const OrganizationNotificationSchema = new Schema({
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: OrganizationNotificationType.getList()
    },
    purchase: {
        type: Types.ObjectId,
        ref: 'purchase'
    },
    coupon: {
        type: Types.ObjectId,
        ref: 'coupon'
    },
    legalInfoRequest: {
        type: Types.ObjectId,
        ref: 'legalinforequest'
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

interface IOrganizationNotificationSchema extends Document {
    type: string;
    timestamp: Date;
    seen: boolean;
};

interface IOrganizationNotificationBase extends IOrganizationNotificationSchema {

};

export interface IOrganizationNotification extends IOrganizationNotificationBase {
    organization: Types.ObjectId;
    purchase: Types.ObjectId;
    coupon: Types.ObjectId;
    legalInfoRequest: Types.ObjectId;
};

export interface IOrganizationNotificationModel extends Model<IOrganizationNotification> {

};

export const OrganizationNotificationModel = model<IOrganizationNotification, IOrganizationNotificationModel>('organizationnotification', OrganizationNotificationSchema);
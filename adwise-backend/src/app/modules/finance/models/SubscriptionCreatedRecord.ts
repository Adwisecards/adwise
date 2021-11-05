import { Document, model, Model, Schema, Types } from "mongoose";
import mongoose from 'mongoose';
import { ISubscription, SubscriptionSchema } from "./Subscription";
import { IInvitation, InvitationSchema } from '../../organizations/models/Invitation';
import { IOrganization, OrganizationSchema } from "../../organizations/models/Organization";
let deepPopulate = require('mongoose-deep-populate')(mongoose);

const SubscriptionCreatedRecordSchema = new Schema({
    subscription: SubscriptionSchema,
    invitation: InvitationSchema,
    organization: OrganizationSchema,
    inviter: {
        type: Types.ObjectId,
        ref: 'user'
    },
    invitee: {
        type: Types.ObjectId,
        ref: 'user'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    oldParent: {
        type: SubscriptionSchema
    },
    newParent: {
        type: SubscriptionSchema
    },
    reason: {
        type: String
    }
});

SubscriptionCreatedRecordSchema.plugin(deepPopulate, {});


interface ISubscriptionCreatedRecordSchema extends Document {
    subscription: ISubscription;
    invitation: IInvitation;
    organization: IOrganization;
    timestamp: Date;
    oldParent: ISubscription;
    newParent: ISubscription;
    reason: string;
};

interface ISubscriptionCreatedRecordBase extends ISubscriptionCreatedRecordSchema {

};

export interface ISubscriptionCreatedRecord extends ISubscriptionCreatedRecordBase {
    inviter: Types.ObjectId;
    invitee: Types.ObjectId;
};

export interface ISubscriptionCreatedRecordModel extends Model<ISubscriptionCreatedRecord> {

};

export const SubscriptionCreatedRecordModel = model<ISubscriptionCreatedRecord, ISubscriptionCreatedRecordModel>('subscriptioncreatedrecord', SubscriptionCreatedRecordSchema);
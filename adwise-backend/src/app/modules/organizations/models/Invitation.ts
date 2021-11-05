import { Document, model, Model, Schema, Types } from "mongoose";
import InvitationType from "../../../core/static/InvitationType";
import { IRef, RefSchema } from "../../ref/models/Ref";

export const InvitationSchema = new Schema({
    subscription: {
        type: Types.ObjectId,
        ref: 'subscription',
        required: true
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    coupon: {
        type: Types.ObjectId,
        ref: 'coupon'
    },
    ref: RefSchema,
    invitationType: {
        type: String,
        enum: InvitationType.getList()
    }
});

interface IInvitationSchema extends Document {
    timestamp: Date;
    ref: IRef;
    invitationType: string;
};

interface IInvitationBase extends IInvitationSchema {

};

export interface IInvitation extends IInvitationBase {
    subscription: Types.ObjectId;
    organization: Types.ObjectId;
    coupon: Types.ObjectId;
};

export interface IInvitationModel extends Model<IInvitation> {};

export const InvitationModel = model<IInvitation, IInvitationModel>('invitation', InvitationSchema);
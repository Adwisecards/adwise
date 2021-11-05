import { Document, model, Model, Schema, Types } from "mongoose";

export const PartnerSchema = new Schema({
    index: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    picture: {
        type: Types.ObjectId,
        ref: 'media',
        required: true
    },
    presentationUrl: {
        type: String
    }
});

interface IPartnerSchema extends Document {
    index: number;
    name: string;
    description: string;
    presentationUrl: string;
};

interface IPartnerBase extends IPartnerSchema {

};

export interface IPartner extends IPartnerBase {
    picture: Types.ObjectId;
};

export interface IPartnerModel extends Model<IPartner> {
    
};

export const PartnerModel = model<IPartner, IPartnerModel>('partner', PartnerSchema);
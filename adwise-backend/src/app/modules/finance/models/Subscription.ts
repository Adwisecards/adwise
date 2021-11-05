import { Document, model, Model, Schema, Types } from "mongoose";
import mongoose from 'mongoose';
let deepPopulate = require('mongoose-deep-populate')(mongoose);

export const SubscriptionSchema = new Schema({
    root: {
        type: Types.ObjectId,
        ref: 'subscription'
    },
    parent: {
        type: Types.ObjectId,
        ref: 'subscription'
    },
    children: [{
        type: Types.ObjectId,
        ref: 'subscription'
    }],
    subscriber: {
        type: Types.ObjectId,
        ref: 'user'
    },
    organization: {
        type: Types.ObjectId,
        ref: 'organization'
    },
    level: {
        type: Number,
        min: 1,
        required: true
    }
});

SubscriptionSchema.plugin(deepPopulate, {
    populate: {
        'children': {
            options: {
                limit: 22
            }
        },
        'children.children': {
            options: {
                limit: 22
            }
        },
        'children.children.children': {
            options: {
                limit: 22
            }
        }
    }
});

interface ISubscriptionSchema extends Document {
    level: number;
};

interface ISubscriptionBase extends ISubscriptionSchema {

};

export interface ISubscription extends ISubscriptionBase {
    root: Types.ObjectId;
    parent: Types.ObjectId;
    children: Types.ObjectId[];
    subscriber: Types.ObjectId;
    organization: Types.ObjectId;
};

export interface ISubscriptionModel extends Model<ISubscription> {
    deepPopulate(path: string): Promise<ISubscription>;
};

export const SubscriptionModel = model<ISubscription, ISubscriptionModel>('subscription', SubscriptionSchema);
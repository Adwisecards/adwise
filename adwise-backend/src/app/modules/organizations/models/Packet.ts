import { Document, model, Model, Schema } from "mongoose";
import Currency from "../../../core/static/Currency";
const Double = require('@mongoosejs/double');

export const PacketSchema = new Schema({
    price: {
        type: Double,
        min: 0,
        required: true
    },
    currency: {
        type: String,
        enum: Currency.getList(),
        required: true
    },
    limit: {
        type: Number,
        min: 0,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // wiseDefault: {
    //     type: Boolean,
    //     default: false
    // },
    timestamp: {
        type: Date,
        default: Date.now
    },
    managerReward: {
        type: Double,
        default: 0
    },
    refBonus: {
        type: Double,
        default: 0
    },
    disabled: {
        type: Boolean,
        default: false
    },
    period: {
        type: Number,
        default: 12
    },
    wisewinOption: {
        type: Boolean,
        default: false
    },
    asWisewinOption: {
        type: Boolean
    }
});

// PacketSchema.path('managerReward').default(function(this: IPacket) {
//     return this.price >= 130 ? 100 : 10;
// });

// PacketSchema.path('refBonus').default(function(this: IPacket) {
//     return this.price >= 130 ? 2 : 1;
// });

interface IPacketSchema extends Document {
    price: number;
    limit: number;
    name: string;
    currency: string;
    // wiseDefault: boolean;
    timestamp: Date;
    managerReward: number;
    refBonus: number;
    disabled: boolean;
    period: number;
    wisewinOption: boolean;
    asWisewinOption: boolean;
};

interface IPacketBase extends IPacketSchema {

};

export interface IPacket extends IPacketBase {

};

export interface IPacketModel extends Model<IPacket> {

};

export const PacketModel = model<IPacket, IPacketModel>('packet', PacketSchema);
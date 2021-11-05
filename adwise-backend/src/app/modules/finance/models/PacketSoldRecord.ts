import { Document, model, Model, Schema, Types } from "mongoose";
import { IOrganization, OrganizationSchema } from "../../organizations/models/Organization";
import { IPacket, PacketSchema } from "../../organizations/models/Packet";
import { IUser, UserSchema } from "../../users/models/User";

const PacketSoldRecordSchema = new Schema({
    packet: PacketSchema,
    manager: UserSchema,
    organization: OrganizationSchema,
    timestamp: {
        type: Date,
        default: Date.now
    },
    reason: {
        type: String,
        default: ''
    },
    old: {
        type: Boolean,
        default: false
    }
});

interface IPacketSoldRecordSchema extends Document {
    packet: IPacket;
    manager: IUser;
    organization: IOrganization;
    timestamp: Date;
    reason: string;
    old: boolean;
};

interface IPacketSoldRecordBase extends IPacketSoldRecordSchema {

};

export interface IPacketSoldRecord extends IPacketSoldRecordBase {

};

export interface IPacketSoldRecordModel extends Model<IPacketSoldRecord, IPacketSoldRecordModel> {

};

export const PacketSoldRecordModel = model<IPacketSoldRecord, IPacketSoldRecordModel>('packetsoldrecord', PacketSoldRecordSchema);
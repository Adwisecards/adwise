import { PacketSoldRecordModel } from "../../models/PacketSoldRecord";
import { PacketSoldRecordRepo } from "./implementation/PacketSoldRecordRepo";

const packetSoldRecordRepo = new PacketSoldRecordRepo(PacketSoldRecordModel);

export {
    packetSoldRecordRepo
};
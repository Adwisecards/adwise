import { PacketModel } from "../../models/Packet";
import { PacketRepo } from "./implementation/PacketRepo";

const packetRepo = new PacketRepo(PacketModel);

export {
    packetRepo
};
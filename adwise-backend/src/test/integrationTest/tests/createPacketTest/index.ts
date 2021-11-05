import { packetRepo } from "../../../../app/modules/organizations/repo/packets";
import { createPacketUseCase } from "../../../../app/modules/organizations/useCases/packets/createPacket";
import { CreatePacketTest } from "./CreatePacketTest";

export const createPacketTest = new CreatePacketTest(
    packetRepo,
    createPacketUseCase
);
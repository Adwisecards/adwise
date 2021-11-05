import { packetRepo } from "../../../repo/packets";
import { DeletePacketController } from "./DeletePacketController";
import { DeletePacketUseCase } from "./DeletePacketUseCase";

const deletePacketUseCase = new DeletePacketUseCase(packetRepo);
const deletePacketController = new DeletePacketController(deletePacketUseCase);

export {
    deletePacketController,
    deletePacketUseCase
};
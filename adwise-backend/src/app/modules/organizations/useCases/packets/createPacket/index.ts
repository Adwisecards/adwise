import { packetRepo } from "../../../repo/packets";
import { packetValidationService } from "../../../services/packets/packetValidationService";
import { CreatePacketController } from "./CreatePacketController";
import { CreatePacketUseCase } from "./CreatePacketUseCase";

const createPacketUseCase = new CreatePacketUseCase(packetRepo, packetValidationService);
const createPacketController = new CreatePacketController(createPacketUseCase);

export {
    createPacketController,
    createPacketUseCase
};
import { packetRepo } from "../../../repo/packets";
import { packetValidationService } from "../../../services/packets/packetValidationService";
import { UpdatePacketController } from "./UpdatePacketController";
import { UpdatePacketUseCase } from "./UpdatePacketUseCase";

export const updatePacketUseCase = new UpdatePacketUseCase(
    packetRepo,
    packetValidationService
);

export const updatePacketController = new UpdatePacketController(
    updatePacketUseCase
);

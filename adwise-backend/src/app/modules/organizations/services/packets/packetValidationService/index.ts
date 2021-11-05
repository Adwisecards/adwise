import { logger } from "../../../../../services/logger";
import { PacketValidationService } from "./implementation/PacketValidationService";

const packetValidationService = new PacketValidationService(logger);

export {
    packetValidationService
};
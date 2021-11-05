import { packetRepo } from "../../../repo/packets";
import { DisablePacketController } from "./DisablePacketController";
import { DisablePacketUseCase } from "./DisablePacketUseCase";

const disablePacketUseCase = new DisablePacketUseCase(packetRepo);
const disablePacketController = new DisablePacketController(disablePacketUseCase);

export {
    disablePacketUseCase,
    disablePacketController
};
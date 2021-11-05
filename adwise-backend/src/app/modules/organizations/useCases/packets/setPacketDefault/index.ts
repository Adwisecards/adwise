import { packetRepo } from "../../../repo/packets";
import { SetPacketDefaultController } from "./SetPacketDefaultController";
import { SetPacketDefaultUseCase } from "./SetPacketDefaultUseCase";

const setPacketDefaultUseCase = new SetPacketDefaultUseCase(packetRepo);
const setPacketDefaultController = new SetPacketDefaultController(setPacketDefaultUseCase);

export {
    setPacketDefaultUseCase,
    setPacketDefaultController
};
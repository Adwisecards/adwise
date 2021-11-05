import { packetSoldRecordRepo } from "../../../repo/packetSoldRecords";
import { CreatePacketSoldRecordUseCase } from "./CreatePacketSoldRecordUseCase";

const createPacketSoldRecordUseCase = new CreatePacketSoldRecordUseCase(packetSoldRecordRepo);

export {
    createPacketSoldRecordUseCase
};
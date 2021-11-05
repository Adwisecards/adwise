import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { createPacketSoldRecordUseCase } from "../createPacketSoldRecord";
import { CreatePacketSoldRecordsUseCase } from "./CreatePacketSoldRecordsUseCase";

const createPacketSoldRecordsUseCase = new CreatePacketSoldRecordsUseCase(organizationRepo, createPacketSoldRecordUseCase, userRepo);

export {
    createPacketSoldRecordsUseCase
};
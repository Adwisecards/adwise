import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { packetRepo } from "../../../repo/packets";
import { packetValidationService } from "../../../services/packets/packetValidationService";
import { generateDocumentsUseCase } from "../../organizations/generateDocuments";
import { setOrganizationPacketUseCase } from "../setOrganizationPacket";
import { ChooseWisewinOptionPacketController } from "./ChooseWisewinOptionPacketController";
import { ChooseWisewinOptionPacketUseCase } from "./ChooseWisewinOptionPacketUseCase";

export const chooseWisewinOptionPacketUseCase = new ChooseWisewinOptionPacketUseCase(
    userRepo,
    packetRepo,
    organizationRepo,
    packetValidationService,
    generateDocumentsUseCase,
    setOrganizationPacketUseCase
);

export const chooseWisewinOptionPacketController = new ChooseWisewinOptionPacketController(
    chooseWisewinOptionPacketUseCase
);
import { organizationRepo } from "../../../repo/organizations";
import { packetRepo } from "../../../repo/packets";
import { packetValidationService } from "../../../services/packets/packetValidationService";
import { generateDocumentsUseCase } from "../../organizations/generateDocuments";
import { addPacketToOrganizationUseCase } from "../addPacketToOrganization";
import { SetOrganizationPacketController } from "./SetOrganizationPacketController";
import { SetOrganizationPacketUseCase } from "./SetOrganizationPacketUseCase";

const setOrganizationPacketUseCase = new SetOrganizationPacketUseCase(
    organizationRepo, 
    packetRepo, 
    addPacketToOrganizationUseCase, 
    packetValidationService,
    generateDocumentsUseCase
);
const setOrganizationPacketController = new SetOrganizationPacketController(setOrganizationPacketUseCase);

export {
    setOrganizationPacketController,
    setOrganizationPacketUseCase
};
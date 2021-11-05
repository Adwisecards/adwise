import { emailService } from "../../../../../services/emailService";
import { globalRepo } from "../../../../administration/repo/globals";
import { legalRepo } from "../../../../legal/repo/legal";
import { generateOrganizationDocumentUseCase } from "../../../../legal/useCases/organizationDocuments/generateOrganizationDocument";
import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { packetRepo } from "../../../repo/packets";
import { packetValidationService } from "../../../services/packets/packetValidationService";
import { generateDocumentsUseCase } from "../../organizations/generateDocuments";
import { RequestPacketController } from "./RequestPacketController";
import { RequestPacketUseCase } from "./RequestPacketUseCase";

const requestPacketUseCase = new RequestPacketUseCase(
    globalRepo, 
    emailService, 
    packetRepo, 
    organizationRepo, 
    userRepo,
    generateOrganizationDocumentUseCase,
    legalRepo,
    packetValidationService
);
const requestPacketController = new RequestPacketController(requestPacketUseCase);

export {
    requestPacketUseCase,
    requestPacketController
};
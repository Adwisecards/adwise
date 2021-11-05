import { backgroundService } from "../../../../../services/backgroundService";
import { currencyService } from "../../../../../services/currencyService";
import { mediaService } from "../../../../../services/mediaService";
import { pdfService } from "../../../../../services/pdfService";
import { wisewinService } from "../../../../../services/wisewinService";
import { globalRepo } from "../../../../administration/repo/globals";
import { walletRepo } from "../../../../finance/repo/wallets";
import { createPacketSoldRecordUseCase } from "../../../../finance/useCases/packetSoldRecords/createPacketSoldRecord";
import { createTransactionUseCase } from "../../../../finance/useCases/transactions/createTransaction";
import { legalRepo } from "../../../../legal/repo/legal";
import { generateOrganizationDocumentUseCase } from "../../../../legal/useCases/organizationDocuments/generateOrganizationDocument";
import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { packetRepo } from "../../../repo/packets";
import { packetValidationService } from "../../../services/packets/packetValidationService";
import { generateDocumentsUseCase } from "../../organizations/generateDocuments";
import { distributePointsFromPacketUseCase } from "../distributePointsFromPacket";
import { AddPacketToOrganizationController } from "./AddPacketToOrganizationController";
import { AddPacketToOrganizationUseCase } from "./AddPacketToOrganizationUseCase";

const addPacketToOrganizationUseCase = new AddPacketToOrganizationUseCase(
    packetRepo, 
    organizationRepo, 
    walletRepo, 
    createTransactionUseCase, 
    wisewinService, 
    userRepo, 
    globalRepo, 
    distributePointsFromPacketUseCase, 
    backgroundService, 
    createPacketSoldRecordUseCase,
    generateOrganizationDocumentUseCase,
    packetValidationService,
    legalRepo
);
const addPacketToOrganizationController = new AddPacketToOrganizationController(addPacketToOrganizationUseCase);

export {
    addPacketToOrganizationUseCase,
    addPacketToOrganizationController
};
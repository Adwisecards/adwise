import { mapsService } from "../../../../../services/mapsService";
import { mediaService } from "../../../../../services/mediaService";
import { telegramService } from "../../../../../services/telegramService";
import { walletRepo } from "../../../../finance/repo/wallets";
import { createWalletUseCase } from "../../../../finance/useCases/wallets/createWallet";
import { generateOrganizationDocumentUseCase } from "../../../../legal/useCases/organizationDocuments/generateOrganizationDocument";
import { addressRepo } from "../../../../maps/repo/addresses";
import { mediaRepo } from "../../../../media/repo";
import { refRepo } from "../../../../ref/repo";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { userRepo } from "../../../../users/repo/users";
import { categoryRepo } from "../../../repo/categories";
import { organizationRepo } from "../../../repo/organizations";
import { packetRepo } from "../../../repo/packets";
import { tagRepo } from "../../../repo/tags";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { createEmployeeUseCase } from "../../employees/createEmployee";
import { addPacketToOrganizationUseCase } from "../../packets/addPacketToOrganization";
import { requestPacketUseCase } from "../../packets/requestPacket";
import { generateDocumentsUseCase } from "../generateDocuments";
import { CreateOrganizationController } from "./CreateOrganizationController";
import { CreateOrganizationUseCase } from "./CreateOrganizationUseCase";

const createOrganizationUseCase = new CreateOrganizationUseCase(
    generateOrganizationDocumentUseCase,
    organizationValidationService,
    createEmployeeUseCase,
    requestPacketUseCase,
    createWalletUseCase,
    organizationRepo,
    createRefUseCase,
    telegramService,
    categoryRepo,
    mediaService,
    addressRepo,
    walletRepo,
    mediaRepo,
    userRepo,
    tagRepo,
    refRepo
);
const createOrganizationController = new CreateOrganizationController(createOrganizationUseCase);

export {
    createOrganizationController,
    createOrganizationUseCase
};
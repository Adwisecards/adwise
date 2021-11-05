import { legalInfoRequestRepo } from "../../../repo/legalInfoRequests";
import { organizationRepo } from "../../../repo/organizations";
import { SatisfyLegalInfoRequestUseCase } from "./SatisfyLegalInfoRequestUseCase";
import { SatisfyLegalInfoRequestController } from './SatisfyLegalInfoRequestController';
import { generateDocumentsUseCase } from "../../organizations/generateDocuments";
import { createOrganizationNotificationUseCase } from "../../organizationNotifications/createOrganizationNotification";
import { generateOrganizationDocumentUseCase } from "../../../../legal/useCases/organizationDocuments/generateOrganizationDocument";
import { updateLegalUseCase } from "../../../../legal/useCases/legal/updateLegal";

export const satisfyLegalInfoRequestUseCase = new SatisfyLegalInfoRequestUseCase(
    organizationRepo,
    updateLegalUseCase,
    legalInfoRequestRepo,
    generateOrganizationDocumentUseCase,
    createOrganizationNotificationUseCase
);

export const satisfyLegalInfoRequestController = new SatisfyLegalInfoRequestController(
    satisfyLegalInfoRequestUseCase
);
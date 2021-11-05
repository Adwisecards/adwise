import { emailService } from "../../../../../services/emailService";
import { timeService } from "../../../../../services/timeService";
import { zipService } from "../../../../../services/zipService";
import { globalRepo } from "../../../../administration/repo/globals";
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { getMediaDataUseCase } from "../../../../media/useCases/getMediaData";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { organizationDocumentRepo } from "../../../repo/organizationDocuments";
import { generateOrganizationDocumentUseCase } from "../generateOrganizationDocument";
import { UpdateOrganizationWithdrawalActDocumentUseCase } from "./UpdateOrganizationWithdrawalActDocumentUseCase";

export const updateOrganizationWithdrawalActDocumentUseCase = new UpdateOrganizationWithdrawalActDocumentUseCase(
    globalRepo,
    zipService,
    emailService,
    purchaseRepo,
    organizationRepo,
    getMediaDataUseCase,
    organizationDocumentRepo,
    generateOrganizationDocumentUseCase
);

timeService.add(updateOrganizationWithdrawalActDocumentUseCase, {
    period: 6
}); // TEMP
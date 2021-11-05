import { emailService } from "../../../../../services/emailService";
import { globalRepo } from "../../../../administration/repo/globals";
import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { SendDocumentsController } from "./SendDocumentsController";
import { SendDocumentsUseCase } from "./SendDocumentsUseCase";

const sendDocumentsUseCase = new SendDocumentsUseCase(emailService, globalRepo, userRepo, organizationRepo);
const sendDocumentsController = new SendDocumentsController(sendDocumentsUseCase);

export {
    sendDocumentsUseCase,
    sendDocumentsController
};
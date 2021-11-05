import { mediaService } from "../../../../../services/mediaService";
import { contactRepo } from "../../../repo/contacts";
import { contactValidationService } from "../../../services/contactValidationService";
import { UpdateContactController } from "./UpdateContactController";
import { UpdateContactUseCase } from "./UpdateContactUseCase";

const updateContactUseCase = new UpdateContactUseCase(contactRepo, contactValidationService, mediaService);
const updateContactController = new UpdateContactController(updateContactUseCase);

export {
    updateContactUseCase,
    updateContactController
};
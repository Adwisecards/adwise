import { mediaService } from "../../../../../services/mediaService";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { userRepo } from "../../../../users/repo/users";
import { contactRepo } from "../../../repo/contacts";
import { contactValidationService } from "../../../services/contactValidationService";
import { CreateContactController } from "./CreateContactController";
import { CreateContactUseCase } from "./CreateContactUseCase";

const createContactUseCase = new CreateContactUseCase(contactValidationService, contactRepo, userRepo, mediaService, createRefUseCase);
const createContactController = new CreateContactController(createContactUseCase);

export {
    createContactController,
    createContactUseCase
};
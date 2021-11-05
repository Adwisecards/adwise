import { userRepo } from "../../../../users/repo/users";
import { contactRepo } from "../../../repo/contacts";
import { contactValidationService } from "../../../services/contactValidationService";
import { FindContactsController } from "./FindContactsController";
import { FindContactsUseCase } from "./FindContactsUseCase";

const findContactsUseCase = new FindContactsUseCase(userRepo, contactRepo, contactValidationService);
const findContactsController = new FindContactsController(findContactsUseCase);

export {
    findContactsUseCase,
    findContactsController
};
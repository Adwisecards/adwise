import { contactRepo } from "../../../../contacts/repo/contacts";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllContactsController } from "./FindAllContactsController";
import { FindAllContactsUseCase } from "./FindAllContactsUseCase";

export const findAllContactsUseCase = new FindAllContactsUseCase(contactRepo, administrationValidationService);
export const findAllContactsController = new FindAllContactsController(findAllContactsUseCase);
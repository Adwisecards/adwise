import { contactRepo } from "../../../repo/contacts";
import { GetContactsController } from "./GetContactsController";
import { GetContactsUseCase } from "./GetContactsUseCase";

const getContactsUseCase = new GetContactsUseCase(contactRepo);
const getContactsController = new GetContactsController(getContactsUseCase);

export {
    getContactsUseCase,
    getContactsController
};
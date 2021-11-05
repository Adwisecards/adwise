import { contactRepo } from "../../../repo/contacts";
import { GetContactController } from "./GetContactController";
import { GetContactUseCase } from "./GetContactUseCase";

const getContactUseCase = new GetContactUseCase(contactRepo);
const getContactController = new GetContactController(getContactUseCase);

export {
    getContactUseCase,
    getContactController
};
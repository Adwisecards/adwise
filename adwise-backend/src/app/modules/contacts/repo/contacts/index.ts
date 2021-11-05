import { ContactModel } from "../../models/Contact";
import { ContactRepo } from "./implementation/ContactRepo";

const contactRepo = new ContactRepo(ContactModel);

export {
    contactRepo
};
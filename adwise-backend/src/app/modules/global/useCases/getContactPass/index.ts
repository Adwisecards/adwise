import { walletService } from "../../../../services/walletService";
import { contactRepo } from "../../../contacts/repo/contacts";
import { organizationRepo } from "../../../organizations/repo/organizations";
import { GetContactPassController } from "./GetContactPassController";
import { GetContactPassUseCase } from "./GetContactPassUseCase";

export const getContactPassUseCase = new GetContactPassUseCase(contactRepo, walletService, organizationRepo);
export const getContactPassController = new GetContactPassController(getContactPassUseCase);
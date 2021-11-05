import { userRepo } from "../../../../users/repo/users";
import { contactRepo } from "../../../repo/contacts";
import { requestRepo } from "../../../repo/requests";
import { cancelRequestUseCase } from "../../requests/cancelRequest";
import { DeleteContactController } from "./DeleteContactController";
import { DeleteContactUseCase } from "./DeleteContactUseCase";

const deleteContactUseCase = new DeleteContactUseCase(userRepo, contactRepo, requestRepo, cancelRequestUseCase);
const deleteContactController = new DeleteContactController(deleteContactUseCase);

export {
    deleteContactController,
    deleteContactUseCase
};
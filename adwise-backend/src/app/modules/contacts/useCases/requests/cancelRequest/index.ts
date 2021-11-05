import { userRepo } from "../../../../users/repo/users";
import { contactRepo } from "../../../repo/contacts";
import { requestRepo } from "../../../repo/requests";
import { CancelRequestController } from "./CancelRequestController";
import { CancelRequestUseCase } from "./CancelRequestUseCase";

const cancelRequestUseCase = new CancelRequestUseCase(userRepo, contactRepo, requestRepo);
const cancelRequestController = new CancelRequestController(cancelRequestUseCase);

export {
    cancelRequestController,
    cancelRequestUseCase
};
import { emailService } from "../../../../services/emailService";
import { globalRepo } from "../../../administration/repo/globals";
import { RequestCallController } from "./RequestCallController";
import { RequestCallUseCase } from "./RequestCallUseCase";

const requestCallUseCase = new RequestCallUseCase(emailService, globalRepo);
const requestCallController = new RequestCallController(requestCallUseCase);

export {
    requestCallController,
    requestCallUseCase
};
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { chatRepo } from "../../../repo/chatRepo";
import { messageRepo } from "../../../repo/messageRepo";
import { messageValidationService } from "../../../services/messages/messageValidationService";
import { CreateMessageController } from "./CreateMessageController";
import { CreateMessageUseCase } from "./CreateMessageUseCase";

export const createMessageUseCase = new CreateMessageUseCase(
    chatRepo,
    userRepo,
    messageRepo,
    organizationRepo,
    messageValidationService
);

export const createMessageController = new CreateMessageController(
    createMessageUseCase
);
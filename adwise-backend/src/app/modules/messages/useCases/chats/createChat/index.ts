import { organizationRepo } from "../../../../organizations/repo/organizations";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { userRepo } from "../../../../users/repo/users";
import { chatRepo } from "../../../repo/chatRepo";
import { chatValidationService } from "../../../services/chats/chatValidationService";
import { CreateChatController } from "./CreateChatController";
import { CreateChatUseCase } from "./CreateChatUseCase";

export const createChatUseCase = new CreateChatUseCase(
    chatRepo,
    userRepo,
    createRefUseCase,
    organizationRepo,
    chatValidationService
);

export const createChatController = new CreateChatController(createChatUseCase);
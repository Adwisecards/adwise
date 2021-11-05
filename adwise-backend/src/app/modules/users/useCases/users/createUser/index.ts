import { backgroundService } from "../../../../../services/backgroundService";
import { wisewinService } from "../../../../../services/wisewinService";
import { createContactUseCase } from "../../../../contacts/useCases/contacts/createContact";
import { createWalletUseCase } from "../../../../finance/useCases/wallets/createWallet";
import { invitationRepo } from "../../../../organizations/repo/invitations";
import { userRepo } from "../../../repo/users";
import { authService } from "../../../services/authService";
import { passwordService } from "../../../services/passwordService";
import { userValidationService } from "../../../services/userValidationService";
import { createVerificationUseCase } from "../../verifications/createVerification";
import { resolveTreeUseCase } from "../resolveTree";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { telegramService } from "../../../../../services/telegramService";

const createUserUseCase: CreateUserUseCase = new CreateUserUseCase(
    userRepo, 
    userValidationService, 
    createVerificationUseCase, 
    authService, 
    createContactUseCase, 
    passwordService, 
    createWalletUseCase, 
    createRefUseCase, 
    wisewinService, 
    backgroundService, 
    resolveTreeUseCase,
    telegramService
);
const createUserController = new CreateUserController(createUserUseCase);

export {
    createUserUseCase,
    createUserController
};
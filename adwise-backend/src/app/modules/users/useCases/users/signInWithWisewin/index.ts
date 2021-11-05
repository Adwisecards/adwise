import { wisewinService } from "../../../../../services/wisewinService";
import { createContactUseCase } from "../../../../contacts/useCases/contacts/createContact";
import { createWalletUseCase } from "../../../../finance/useCases/wallets/createWallet";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { userRepo } from "../../../repo/users";
import { authService } from "../../../services/authService";
import { createUserUseCase } from "../createUser";
import { resolveTreeUseCase } from "../resolveTree";
import { SignInWithWisewinController } from "./SignInWithWisewinController";
import { SignInWithWisewinUseCase } from "./SignInWithWisewinUseCase";

const signInWithWisewinUseCase = new SignInWithWisewinUseCase(
    wisewinService, 
    userRepo, 
    authService, 
    createWalletUseCase, 
    createRefUseCase, 
    createContactUseCase, 
    resolveTreeUseCase,
    createUserUseCase
);
const signInWithWisewinController = new SignInWithWisewinController(signInWithWisewinUseCase);

export {
    signInWithWisewinUseCase,
    signInWithWisewinController
}
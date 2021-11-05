import { userRepo } from "../../../../users/repo/users";
import { withdrawalRequestTokenService } from "../../../services/withdrawalRequests/withdrawalRequestTokenService";
import { CreateWithdrawalRequestTokenController } from "./CreateWithdrawalRequestTokenController";
import { CreateWithdrawalRequestTokenUseCase } from "./CreateWithdrawalRequestTokenUseCase";

const createWithdrawalRequestTokenUseCase = new CreateWithdrawalRequestTokenUseCase(userRepo, withdrawalRequestTokenService);
const createWithdrawalRequestTokenController = new CreateWithdrawalRequestTokenController(createWithdrawalRequestTokenUseCase);

export {
    createWithdrawalRequestTokenUseCase,
    createWithdrawalRequestTokenController
};
import { globalRepo } from "../../../../administration/repo/globals";
import { userRepo } from "../../../../users/repo/users";
import { withdrawalRequestTokenService } from "../../../services/withdrawalRequests/withdrawalRequestTokenService";
import { GetWithdrawalRequestDataController } from "./GetWithdrawalRequestDataController";
import { GetWithdrawalRequestDataUseCase } from "./GetWithdrawalRequestDataUseCase";

const getWithdrawalRequestDataUseCase = new GetWithdrawalRequestDataUseCase(globalRepo, userRepo, withdrawalRequestTokenService);
const getWithdrawalRequestDataController = new GetWithdrawalRequestDataController(getWithdrawalRequestDataUseCase);

export {
    getWithdrawalRequestDataUseCase,
    getWithdrawalRequestDataController
};
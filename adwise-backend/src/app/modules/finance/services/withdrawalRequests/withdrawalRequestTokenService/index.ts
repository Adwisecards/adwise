import { configProps } from "../../../../../services/config";
import { WithdrawalRequestTokenService } from "./implementation/WithdrawalRequestTokenService";

const withdrawalRequestTokenService = new WithdrawalRequestTokenService(configProps.appSecret, '1 day');

export {
    withdrawalRequestTokenService
};
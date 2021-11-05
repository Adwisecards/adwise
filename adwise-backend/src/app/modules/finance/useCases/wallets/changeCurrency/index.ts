import { currencyService } from "../../../../../services/currencyService";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { walletRepo } from "../../../repo/wallets";
import { ChangeCurrencyController } from "./ChangeCurrencyController";
import { ChangeCurrencyUseCase } from "./ChangeCurrencyUseCase";

const changeCurrencyUseCase = new ChangeCurrencyUseCase(userRepo, organizationRepo, walletRepo, currencyService);
const changeCurrencyController = new ChangeCurrencyController(changeCurrencyUseCase);

export {
    changeCurrencyUseCase,
    changeCurrencyController
};
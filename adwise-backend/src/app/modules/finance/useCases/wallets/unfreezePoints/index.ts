import { timeService } from "../../../../../services/timeService";
import { globalRepo } from "../../../../administration/repo/globals";
import { walletRepo } from "../../../repo/wallets";
import { UnfreezePointsUseCase } from "./UnfreezePointsUseCase";

const unfreezePointsUseCase = new UnfreezePointsUseCase(walletRepo, globalRepo);

// timeService.add(unfreezePointsUseCase);
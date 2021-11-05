import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { getLevelSubscriptionsUseCase } from "../../../../finance/useCases/subscriptions/getLevelSubscriptions";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../repo/users";
import { getUserFinancialStatisticsUseCase } from "../getUserFinancialStatistics";
import { getWisewinStatisticsUseCase } from "../getWisewinStatistics";
import { GetWisewinManagerStatisticsController } from "./GetWisewinManagerStatisticsController";
import { GetWisewinManagerStatisticsUseCase } from "./GetWisewinManagerStatisticsUseCase";

const getWisewinManagerStatisticsUseCase = new GetWisewinManagerStatisticsUseCase(userRepo, organizationRepo, getUserFinancialStatisticsUseCase, getLevelSubscriptionsUseCase, getWisewinStatisticsUseCase, subscriptionRepo);
const getWisewinManagerStatisticsController = new GetWisewinManagerStatisticsController(getWisewinManagerStatisticsUseCase);

export {
    getWisewinManagerStatisticsUseCase,
    getWisewinManagerStatisticsController
};


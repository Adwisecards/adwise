import { purchaseRepo } from "../../../../finance/repo/purchases";
import { clientRepo } from "../../../repo/clients";
import { organizationRepo } from "../../../repo/organizations";
import { getOrganizationStatisticsUseCase } from "../../organizationStatistics/getOrganizationStatistics";
import { GetOrganizationClientStatisticsController } from "./GetOrganizationClientStatisticsController";
import { GetOrganizationClientStatisticsUseCase } from "./GetOrganizationClientStatisticsUseCase";

export const getOrganizationClientStatisticsUseCase = new GetOrganizationClientStatisticsUseCase(
    organizationRepo, 
    clientRepo,
    getOrganizationStatisticsUseCase
);
export const getOrganizationClientStatisticsController = new GetOrganizationClientStatisticsController(getOrganizationClientStatisticsUseCase);
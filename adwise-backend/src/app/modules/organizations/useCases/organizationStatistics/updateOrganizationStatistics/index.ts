import { timeService } from "../../../../../services/timeService";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { withdrawalRequestRepo } from "../../../../finance/repo/withdrawalRequests";
import { clientRepo } from "../../../repo/clients";
import { organizationRepo } from "../../../repo/organizations";
import { organizationStatisticsRepo } from "../../../repo/organizationStatistics";
import { organizationStatisticsService } from "../../../services/organizations/organizationStatisticsService";
import { UpdateOrganizationStatisticsUseCase } from "./UpdateOrganizationStatisticsUseCase";

export const updateOrganizationStatisticsUseCase = new UpdateOrganizationStatisticsUseCase(
    organizationRepo,
    withdrawalRequestRepo,
    organizationStatisticsRepo,
    transactionRepo,
    organizationStatisticsService,
    clientRepo
);

timeService.add(updateOrganizationStatisticsUseCase);
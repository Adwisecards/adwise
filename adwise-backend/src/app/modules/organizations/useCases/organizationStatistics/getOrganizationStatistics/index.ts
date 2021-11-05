import { organizationRepo } from "../../../repo/organizations";
import { organizationStatisticsRepo } from "../../../repo/organizationStatistics";
import { GetOrganizationStatisticsController } from "./GetOrganizationStatisticsController";
import { GetOrganizationStatisticsUseCase } from "./GetOrganizationStatisticsUseCase";

export const getOrganizationStatisticsUseCase = new GetOrganizationStatisticsUseCase(organizationStatisticsRepo, organizationRepo);
export const getOrganizationStatisticsController = new GetOrganizationStatisticsController(getOrganizationStatisticsUseCase);
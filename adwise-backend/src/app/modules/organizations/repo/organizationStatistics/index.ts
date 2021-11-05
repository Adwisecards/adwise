import { OrganizationStatisticsModel } from "../../models/OrganizationStatistics";
import { OrganizationStatisticsRepo } from "./implementation/OrganizationStatisticsRepo";

export const organizationStatisticsRepo = new OrganizationStatisticsRepo(OrganizationStatisticsModel);
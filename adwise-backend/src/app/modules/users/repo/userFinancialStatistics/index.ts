import { UserFinancialStatisticsModel } from "../../models/UserFinancialStatistics";
import { UserFinancialStatisticsRepo } from "./implementation/UserFinancialStatisticsRepo";

export const userFinancialStatisticsRepo = new UserFinancialStatisticsRepo(UserFinancialStatisticsModel);
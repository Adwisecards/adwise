import { timeService } from "../../../../../services/timeService";
import { couponRepo } from "../../../repo/coupons";
import { organizationStatisticsService } from "../../../services/organizations/organizationStatisticsService";
import { UpdateCouponStatisticsUseCase } from "./UpdateCouponStatisticsUseCase";

export const updateCouponStatisticsUseCase = new UpdateCouponStatisticsUseCase(
    couponRepo,
    organizationStatisticsService
);

timeService.add(updateCouponStatisticsUseCase);
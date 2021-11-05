import { timeService } from "../../../../../services/timeService";
import { couponRepo } from "../../../repo/coupons";
import { createOrganizationNotificationUseCase } from "../../organizationNotifications/createOrganizationNotification";
import { CheckCouponUseCase } from "./CheckCouponUseCase";

const checkCouponUseCase = new CheckCouponUseCase(
    couponRepo,
    createOrganizationNotificationUseCase
);

timeService.add(checkCouponUseCase);
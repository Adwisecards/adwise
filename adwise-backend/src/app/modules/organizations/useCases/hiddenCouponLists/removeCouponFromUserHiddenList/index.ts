import { couponRepo } from "../../../repo/coupons";
import { hiddenCouponListRepo } from "../../../repo/hiddenCouponLists";
import { RemoveCouponFromUserHiddenListController } from "./RemoveCouponFromUserHiddenListController";
import { RemoveCouponFromUserHiddenListUseCase } from "./RemoveCouponFromUserHiddenListUseCase";

export const removeCouponFromUserHiddenListUseCase = new RemoveCouponFromUserHiddenListUseCase(hiddenCouponListRepo, couponRepo);
export const removeCouponFromUserHiddenListController = new RemoveCouponFromUserHiddenListController(removeCouponFromUserHiddenListUseCase);
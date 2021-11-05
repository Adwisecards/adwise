import { couponRepo } from "../../../repo/coupons";
import { hiddenCouponListRepo } from "../../../repo/hiddenCouponLists";
import { GetUserHiddenCouponsController } from "./GetUserHiddenCouponsController";
import { GetUserHiddenCouponsUseCase } from "./GetUserHiddenCouponsUseCase";

export const getUserHiddenCouponsUseCase = new GetUserHiddenCouponsUseCase(hiddenCouponListRepo, couponRepo);
export const getUserHiddenCouponsController = new GetUserHiddenCouponsController(getUserHiddenCouponsUseCase);

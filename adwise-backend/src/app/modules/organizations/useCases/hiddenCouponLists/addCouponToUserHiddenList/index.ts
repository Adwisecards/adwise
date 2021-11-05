import { couponRepo } from "../../../repo/coupons";
import { hiddenCouponListRepo } from "../../../repo/hiddenCouponLists";
import { AddCouponToUserHiddenListController } from "./AddCouponToUserHiddenListController";
import { AddCouponToUserHiddenListUseCase } from "./AddCouponToUserHiddenListUseCase";

export const addCouponToUserHiddenListUseCase = new AddCouponToUserHiddenListUseCase(hiddenCouponListRepo, couponRepo);
export const addCouponToUserHiddenListController = new AddCouponToUserHiddenListController(addCouponToUserHiddenListUseCase);
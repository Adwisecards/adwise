import { couponRepo } from "../../../repo/coupons";
import { favoriteCouponListRepo } from "../../../repo/favoriteCouponLists";
import { AddCouponToUserFavoriteListController } from "./AddCouponToUserFavoriteListController";
import { AddCouponToUserFavoriteListUseCase } from "./AddCouponToUserFavoriteListUseCase";

export const addCouponToUserFavoriteListUseCase = new AddCouponToUserFavoriteListUseCase(favoriteCouponListRepo, couponRepo);
export const addCouponToUserFavoriteListController = new AddCouponToUserFavoriteListController(addCouponToUserFavoriteListUseCase);
import { couponRepo } from "../../../repo/coupons";
import { favoriteCouponListRepo } from "../../../repo/favoriteCouponLists";
import { RemoveCouponFromUserFavoriteListController } from "./RemoveCouponFromUserFavoriteListController";
import { RemoveCouponFromUserFavoriteListUseCase } from "./RemoveCouponFromUserFavoriteListUseCase";

export const removeCouponFromUserFavoriteListUseCase = new RemoveCouponFromUserFavoriteListUseCase(favoriteCouponListRepo, couponRepo);
export const removeCouponFromuserFavoriteListController = new RemoveCouponFromUserFavoriteListController(removeCouponFromUserFavoriteListUseCase);
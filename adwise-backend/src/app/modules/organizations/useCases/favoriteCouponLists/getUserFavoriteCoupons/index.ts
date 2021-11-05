import { couponRepo } from "../../../repo/coupons";
import { favoriteCouponListRepo } from "../../../repo/favoriteCouponLists";
import { GetUserFavoriteCouponsController } from "./GetUserFavoriteCouponsController";
import { GetUserFavoriteCouponsUseCase } from "./GetUserFavoriteCouponsUseCase";

export const getUserFavoriteCouponsUseCase = new GetUserFavoriteCouponsUseCase(favoriteCouponListRepo, couponRepo);
export const getUserFavoriteCouponsController = new GetUserFavoriteCouponsController(getUserFavoriteCouponsUseCase);
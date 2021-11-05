import { FavoriteCouponListModel } from "../../models/FavoriteCouponList";
import { FavoriteCouponListRepo } from "./implementation/FavoriteCouponListRepo";

export const favoriteCouponListRepo = new FavoriteCouponListRepo(FavoriteCouponListModel);
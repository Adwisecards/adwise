import { HiddenCouponListModel } from "../../models/HiddenCouponList";
import { HiddenCouponListRepo } from "./implementation/HiddenCouponListRepo";

export const hiddenCouponListRepo = new HiddenCouponListRepo(HiddenCouponListModel);
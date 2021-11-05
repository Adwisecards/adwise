import { CouponModel } from "../../models/Coupon";
import { CouponRepo } from "./implementation/CouponRepo";

const couponRepo = new CouponRepo(CouponModel);

export {
    couponRepo
};
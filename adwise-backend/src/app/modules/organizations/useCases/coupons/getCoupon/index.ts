import { couponRepo } from "../../../repo/coupons";
import { GetCouponUseCase } from "./GetCouponUseCase";
import { GetCouponController } from './GetCouponController';

const getCouponUseCase = new GetCouponUseCase(couponRepo);
const getCouponController = new GetCouponController(getCouponUseCase);

export {
    getCouponUseCase,
    getCouponController
};
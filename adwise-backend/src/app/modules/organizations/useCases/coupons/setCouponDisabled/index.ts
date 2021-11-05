import { couponRepo } from "../../../repo/coupons";
import { SetCouponDisabledController } from "./SetCouponDisabledController";
import { SetCouponDisabledUseCase } from "./SetCouponDisabledUseCase";

const setCouponDisabledUseCase = new SetCouponDisabledUseCase(couponRepo);
const setCouponDisabledController = new SetCouponDisabledController(setCouponDisabledUseCase);

export {
    setCouponDisabledUseCase,
    setCouponDisabledController
};
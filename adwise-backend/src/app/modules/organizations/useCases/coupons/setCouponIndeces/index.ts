import { couponRepo } from "../../../repo/coupons";
import { SetCouponIndecesController } from "./SetCouponIndecesController";
import { SetCouponIndecesUseCase } from "./SetCouponIndecesUseCase";

const setCouponIndecesUseCase = new SetCouponIndecesUseCase(couponRepo);
const setCouponIndecesController = new SetCouponIndecesController(setCouponIndecesUseCase);

export {
    setCouponIndecesUseCase,
    setCouponIndecesController
};
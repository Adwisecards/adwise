import { contactRepo } from "../../../../contacts/repo/contacts";
import { GetCouponsByCategoryController } from "./GetCouponsByCategoryController";
import { GetCouponsByCategoryUseCase } from "./GetCouponsByCategoryUseCase";

const getCouponsByCategoryUseCase = new GetCouponsByCategoryUseCase(contactRepo);
const getCouponsByCategoryController = new GetCouponsByCategoryController(getCouponsByCategoryUseCase);

export {
    getCouponsByCategoryUseCase,
    getCouponsByCategoryController
};
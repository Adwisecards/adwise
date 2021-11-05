import { contactRepo } from "../../../../contacts/repo/contacts";
import { eventListenerService } from "../../../../global/services/eventListenerService";
import { couponRepo } from "../../../repo/coupons";
import { DeleteCouponFromContactController } from "./DeleteCouponFromContactController";
import { DeleteCouponFromContactUseCase } from "./DeleteCouponFromContactUseCase";

const deleteCouponFromContactUseCase = new DeleteCouponFromContactUseCase(couponRepo, contactRepo, eventListenerService);
const deleteCouponFromContactController = new DeleteCouponFromContactController(deleteCouponFromContactUseCase);

export {
    deleteCouponFromContactController, 
    deleteCouponFromContactUseCase
};
import { contactRepo } from "../../../../contacts/repo/contacts";
import { eventListenerService } from "../../../../global/services/eventListenerService";
import { clientRepo } from "../../../repo/clients";
import { couponRepo } from "../../../repo/coupons";
import { organizationRepo } from "../../../repo/organizations";
import { AddCouponToContactController } from "./AddCouponToContactController";
import { AddCouponToContactUseCase } from "./AddCouponToContactUseCase";

const addCouponToContactUseCase = new AddCouponToContactUseCase(
    couponRepo, 
    contactRepo, 
    eventListenerService, 
    organizationRepo,
    clientRepo
);
const addCouponToContactController = new AddCouponToContactController(addCouponToContactUseCase);

export {
    addCouponToContactUseCase,
    addCouponToContactController
};
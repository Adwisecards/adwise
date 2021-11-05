import { contactRepo } from "../../../../contacts/repo/contacts";
import { GetCategoryCouponsController } from "./GetCategoryCouponsController";
import { GetCategoryCouponsUseCase } from "./GetCategoryCouponsUseCase";

const getCategoryCouponsUseCase = new GetCategoryCouponsUseCase(contactRepo);
const getCategoryCouponsController = new GetCategoryCouponsController(getCategoryCouponsUseCase);

export {
    getCategoryCouponsUseCase,
    getCategoryCouponsController
};
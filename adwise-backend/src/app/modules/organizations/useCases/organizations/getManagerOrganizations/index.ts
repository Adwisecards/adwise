import { purchaseRepo } from "../../../../finance/repo/purchases";
import { userRepo } from "../../../../users/repo/users";
import { authService } from "../../../../users/services/authService";
import { couponRepo } from "../../../repo/coupons";
import { organizationRepo } from "../../../repo/organizations";
import { GetManagerOrganizationsController } from "./GetManagerOrganizationsController";
import { GetManagerOrganizationsUseCase } from "./GetManagerOrganizationsUseCase";

const getManagerOrganizationsUseCase = new GetManagerOrganizationsUseCase(userRepo, organizationRepo, authService, couponRepo, purchaseRepo);
const getManagerOrganizationsController = new GetManagerOrganizationsController(getManagerOrganizationsUseCase);

export {
    getManagerOrganizationsUseCase,
    getManagerOrganizationsController
};
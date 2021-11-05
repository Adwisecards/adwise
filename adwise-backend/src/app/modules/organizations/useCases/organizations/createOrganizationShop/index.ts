import { paymentService } from "../../../../../services/paymentService";
import { legalRepo } from "../../../../legal/repo/legal";
import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { CreateOrganizationUseCase } from "../createOrganization/CreateOrganizationUseCase";
import { CreateOrganizationShopController } from "./CreateOrganizationShopConrtoller";
import { CreateOrganizationShopUseCase } from "./CreateOrganizationShopUseCase";

export const createOrganizationShopUseCase = new CreateOrganizationShopUseCase(
    organizationRepo, 
    paymentService, 
    organizationValidationService,
    legalRepo,
    userRepo
);
export const createOrganizationShopController = new CreateOrganizationShopController(createOrganizationShopUseCase);
import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { FindOrganizationsController } from "./FindOrganizationsController";
import { FindOrganizationsUseCase } from "./FindOrganizationsUseCase";

const findOrganizationsUseCase = new FindOrganizationsUseCase(userRepo, organizationRepo, organizationValidationService);
const findOrganizationsController = new FindOrganizationsController(findOrganizationsUseCase);

export {
    findOrganizationsUseCase,
    findOrganizationsController
};
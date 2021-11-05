import { organizationRepo } from "../../../repo/organizations";
import { GetOrganizationController } from "./GetOrganizationController";
import { GetOrganizationUseCase } from "./GetOrganizationUseCase";

const getOrganizationUseCase = new GetOrganizationUseCase(organizationRepo);
const getOrganizationController = new GetOrganizationController(getOrganizationUseCase);

export {
    getOrganizationController,
    getOrganizationUseCase
};
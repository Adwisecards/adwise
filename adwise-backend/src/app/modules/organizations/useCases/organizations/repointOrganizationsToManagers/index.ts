import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { RepointOrganizationsToManagersUseCase } from "./RepointOrganizationsToManagersUseCase";

const repointOrganizationsToManagersUseCase = new RepointOrganizationsToManagersUseCase(organizationRepo, userRepo);

export {
    repointOrganizationsToManagersUseCase
};
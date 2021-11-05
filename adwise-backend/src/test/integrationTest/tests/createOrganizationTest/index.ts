import { contactRepo } from "../../../../app/modules/contacts/repo/contacts";
import { walletRepo } from "../../../../app/modules/finance/repo/wallets";
import { employeeRepo } from "../../../../app/modules/organizations/repo/employees";
import { organizationRepo } from "../../../../app/modules/organizations/repo/organizations";
import { createOrganizationUseCase } from "../../../../app/modules/organizations/useCases/organizations/createOrganization";
import { userRepo } from "../../../../app/modules/users/repo/users";
import { CreateOrganizationTest } from "./CreateOrganizationTest";

export const createOrganizationTest = new CreateOrganizationTest(
    userRepo,
    walletRepo,
    contactRepo,
    employeeRepo,
    organizationRepo,
    createOrganizationUseCase
);
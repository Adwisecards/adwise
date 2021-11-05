import { globalRepo } from "../../../../app/modules/administration/repo/globals";
import { setOrganizationGlobalUseCase } from "../../../../app/modules/administration/useCases/globals/setOrganizationGlobal";
import { legalRepo } from "../../../../app/modules/legal/repo/legal";
import { createLegalUseCase } from "../../../../app/modules/legal/useCases/legal/createLegal";
import { organizationRepo } from "../../../../app/modules/organizations/repo/organizations";
import { SetOrganizationTest } from "./SetOrganizationTest";

export const setOrganizationTest = new SetOrganizationTest(
    legalRepo,
    globalRepo,
    organizationRepo,
    createLegalUseCase,
    setOrganizationGlobalUseCase
);
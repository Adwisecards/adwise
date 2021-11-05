import { organizationRepo } from "../../../repo/organizations";
import { SetOrganizationSignedController } from "./SetOrganizationSignedController";
import { SetOrganizationSignedUseCase } from "./SetOrganizationSignedUseCase";

const setOrganizationSignedUseCase = new SetOrganizationSignedUseCase(organizationRepo);
const setOrganizationSignedController = new SetOrganizationSignedController(setOrganizationSignedUseCase);

export {
    setOrganizationSignedUseCase,
    setOrganizationSignedController
};
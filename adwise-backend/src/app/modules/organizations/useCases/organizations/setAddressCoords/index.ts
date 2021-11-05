import { organizationRepo } from "../../../repo/organizations";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { SetAddressCoordsController } from "./SetAddressCoordsController";
import { SetAddressCoordsUseCase } from "./SetAddressCoordsUseCase";

export const setAddressCoordsUseCase = new SetAddressCoordsUseCase(
    organizationRepo,
    organizationValidationService
);

export const setAddressCoordsController = new SetAddressCoordsController(
    setAddressCoordsUseCase
);
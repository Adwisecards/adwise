import { mapsService } from "../../../../../services/mapsService";
import { mediaService } from "../../../../../services/mediaService";
import { addressRepo } from "../../../../maps/repo/addresses";
import { mediaRepo } from "../../../../media/repo";
import { userRepo } from "../../../../users/repo/users";
import { categoryRepo } from "../../../repo/categories";
import { organizationRepo } from "../../../repo/organizations";
import { tagRepo } from "../../../repo/tags";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { UpdateOrganizationController } from "./UpdateOrganizationController";
import { UpdateOrganizationUseCase } from "./UpdateOrganizationUseCase";

const updateOrganizationUseCase = new UpdateOrganizationUseCase(
    tagRepo,
    userRepo,
    mediaRepo,
    mapsService,
    addressRepo,
    categoryRepo,
    mediaService,
    organizationRepo,
    organizationValidationService
);
const updateOrganizationController = new UpdateOrganizationController(updateOrganizationUseCase);

export {
    updateOrganizationUseCase,
    updateOrganizationController
};
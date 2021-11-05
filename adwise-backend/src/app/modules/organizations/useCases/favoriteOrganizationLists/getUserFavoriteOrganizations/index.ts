import { userRepo } from "../../../../users/repo/users";
import { favoriteOrganizationListRepo } from "../../../repo/favoriteOrganizationLists";
import { organizationRepo } from "../../../repo/organizations";
import { favoriteOrganizationListValidationService } from "../../../services/favoriteOrganizationLists/favoriteOrganizationListValidationService";
import { GetUserFavoriteOrganizationsController } from "./GetUserFavoriteOrganizationsController";
import { GetUserFavoriteOrganizationsUseCase } from "./GetUserFavoriteOrganizationsUseCase";

export const getUserFavoriteOrganizationsUseCase = new GetUserFavoriteOrganizationsUseCase(
    userRepo,
    organizationRepo,
    favoriteOrganizationListRepo,
    favoriteOrganizationListValidationService
);

export const getUserFavoriteOrganizationsController = new GetUserFavoriteOrganizationsController(
    getUserFavoriteOrganizationsUseCase
);
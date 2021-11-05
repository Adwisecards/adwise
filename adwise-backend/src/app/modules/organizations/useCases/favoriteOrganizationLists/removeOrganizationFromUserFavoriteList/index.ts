import { userRepo } from "../../../../users/repo/users";
import { favoriteOrganizationListRepo } from "../../../repo/favoriteOrganizationLists";
import { organizationRepo } from "../../../repo/organizations";
import { favoriteOrganizationListValidationService } from "../../../services/favoriteOrganizationLists/favoriteOrganizationListValidationService";
import { RemoveOrganizationFromUserFavoriteListController } from "./RemoveOrganizationFromUserFavoriteListController";
import { RemoveOrganizationFromUserFavoriteListUseCase } from "./RemoveOrganizationFromUserFavoriteListUseCase";

export const removeOrganizationFromUserFavoriteListUseCase = new RemoveOrganizationFromUserFavoriteListUseCase(
    userRepo,
    organizationRepo,
    favoriteOrganizationListRepo,
    favoriteOrganizationListValidationService
);

export const removeOrganizationFromUserFavoriteListController = new RemoveOrganizationFromUserFavoriteListController(
    removeOrganizationFromUserFavoriteListUseCase
);
import { userRepo } from "../../../../users/repo/users";
import { clientRepo } from "../../../repo/clients";
import { favoriteOrganizationListRepo } from "../../../repo/favoriteOrganizationLists";
import { organizationRepo } from "../../../repo/organizations";
import { favoriteOrganizationListValidationService } from "../../../services/favoriteOrganizationLists/favoriteOrganizationListValidationService";
import { AddOrganizationToUserFavoriteListController } from "./AddOrganizationToUserFavoriteListController";
import { AddOrganizationToUserFavoriteListUseCase } from "./AddOrganizationToUserFavoriteListUseCase";

export const addOrganizationToUserFavoriteListUseCase = new AddOrganizationToUserFavoriteListUseCase(
    userRepo,
    clientRepo,
    organizationRepo,
    favoriteOrganizationListRepo,
    favoriteOrganizationListValidationService
);

export const addOrganizationToUserFavoriteListController = new AddOrganizationToUserFavoriteListController(
    addOrganizationToUserFavoriteListUseCase
);
import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { addOrganizationToUserFavoriteListController } from "../../../useCases/favoriteOrganizationLists/addOrganizationToUserFavoriteList";
import { getUserFavoriteOrganizationsController } from "../../../useCases/favoriteOrganizationLists/getUserFavoriteOrganizations";
import { removeOrganizationFromUserFavoriteListController } from "../../../useCases/favoriteOrganizationLists/removeOrganizationFromUserFavoriteList";

export const favoriteOrganizationListRouter = Router();

favoriteOrganizationListRouter.get('/get-user-favorite-organizations', applyBlock, applyAuth, (req, res) => getUserFavoriteOrganizationsController.execute(req, res));
favoriteOrganizationListRouter.put('/add-organization-to-user-favorite-list', applyBlock, applyAuth, (req, res) => addOrganizationToUserFavoriteListController.execute(req, res));
favoriteOrganizationListRouter.put('/remove-organization-from-user-favorite-list', applyBlock, applyAuth, (req, res) => removeOrganizationFromUserFavoriteListController.execute(req, res));

/*
[
    {   
        "name": "get user favorite organizations",
        "path": "/organizations/get-user-favorite-organizations",
        "dto": "src/app/modules/organizations/useCases/favoriteOrganizationLists/getUserFavoriteOrganizations/GetUserFavoriteOrganizationsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/favoriteOrganizationLists/getUserFavoriteOrganizations/getUserFavoriteOrganizationsErrors.ts",
        "method": "GET",
        "description": "Возвращает лист избранных организаций пользователя."
    },
    {   
        "name": "add organization to user favorite list",
        "path": "/organizations/add-organization-to-user-favorite-list",
        "dto": "src/app/modules/organizations/useCases/favoriteOrganizationLists/addOrganizationToUserFavoriteList/AddOrganizationToUserFavoriteListDTO.ts",
        "errors": "src/app/modules/organizations/useCases/favoriteOrganizationLists/addOrganizationToUserFavoriteList/addOrganizationToUserFavoriteListErrors.ts",
        "method": "PUT",
        "description": "Добавляет организацию в лист избранных организаций пользователя."
    },
    {   
        "name": "remove organization from user favorite list",
        "path": "/organizations/remove-organization-from-user-favorite-list",
        "dto": "src/app/modules/organizations/useCases/favoriteOrganizationLists/removeOrganizationFromUserFavoriteList/RemoveOrganizationFromUserFavoriteListDTO.ts",
        "errors": "src/app/modules/organizations/useCases/favoriteOrganizationLists/removeOrganizationFromUserFavoriteList/removeOrganizationFromUserFavoriteListErrors.ts",
        "method": "PUT",
        "description": "Убирает организацию из листа избранных организаций пользователя."
    }
]
*/
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { couponRepo } from "../../../repo/coupons";
import { employeeRepo } from "../../../repo/employees";
import { favoriteOrganizationListRepo } from "../../../repo/favoriteOrganizationLists";
import { organizationRepo } from "../../../repo/organizations";
import { removeOrganizationFromUserFavoriteListUseCase } from "../../favoriteOrganizationLists/removeOrganizationFromUserFavoriteList";
import { SetOrganizationDisabledController } from "./SetOrganizationDisabledController";
import { SetOrganizationDisabledUseCase } from "./SetOrganizationDisabledUseCase";

const setOrganizationDisabledUseCase = new SetOrganizationDisabledUseCase(
    organizationRepo, 
    couponRepo, 
    employeeRepo,
    favoriteOrganizationListRepo,
    removeOrganizationFromUserFavoriteListUseCase,
    purchaseRepo
);
const setOrganizationDisabledController = new SetOrganizationDisabledController(setOrganizationDisabledUseCase);

export {
    setOrganizationDisabledUseCase,
    setOrganizationDisabledController
};
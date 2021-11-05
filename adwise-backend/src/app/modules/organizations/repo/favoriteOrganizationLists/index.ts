import { FavoriteOrganizationListModel } from "../../models/FavoriteOrganizationList";
import { FavoriteOrganizationListRepo } from "./implementation/FavoriteOrganizationListRepo";

export const favoriteOrganizationListRepo = new FavoriteOrganizationListRepo(FavoriteOrganizationListModel);
import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IFavoriteOrganizationList } from "../../models/FavoriteOrganizationList";

export interface IFavoriteOrganizationListRepo extends IRepo<IFavoriteOrganizationList> {
    findByUser(userId: string): RepoResult<IFavoriteOrganizationList>;
    removeOrganizationFromMany(organizationId: string): RepoResult<any>;
}
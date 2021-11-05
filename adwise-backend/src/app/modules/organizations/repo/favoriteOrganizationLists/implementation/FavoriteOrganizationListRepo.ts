import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IFavoriteOrganizationList, IFavoriteOrganizationListModel } from "../../../models/FavoriteOrganizationList";
import { IFavoriteOrganizationListRepo } from "../IFavoriteOrganizationListRepo";

export class FavoriteOrganizationListRepo extends Repo<IFavoriteOrganizationList, IFavoriteOrganizationListModel> implements IFavoriteOrganizationListRepo {
    public async findByUser(userId: string) {
        try {
            const favoriteOrganizationList = await this.Model.findOne({
                user: userId
            });

            if (!favoriteOrganizationList) {
                return Result.fail(new RepoError('Favorite organization list is not found', 404));
            }

            return Result.ok(favoriteOrganizationList);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async removeOrganizationFromMany(organizationId: string) {
        try {
            const result = await this.Model.updateMany({organizations: {$in: [organizationId]}}, {
                $pull: {'organizations': organizationId}
            });

            console.log(result);

            return Result.ok(true);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
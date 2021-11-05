import { boolean } from "joi";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { ILegal, ILegalModel } from "../../../models/Legal";
import { ILegalRepo } from "../ILegalRepo";

export class LegalRepo extends Repo<ILegal, ILegalModel> implements ILegalRepo {
    public async findByOrganizationAndRelevant(organizationId: string, relevant: boolean) {
        try {
            const legal = await this.Model.findOne({
                organization: organizationId,
                relevant: relevant
            });

            if (!legal) {
                return Result.fail(new RepoError('Legal does not exist', 404));
            }

            return Result.ok(legal);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByOrganization(organizationId: string) {
        try {
            const legals = await this.Model.find({organization: organizationId}).sort({_id: -1});

            return Result.ok(legals);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByInnAndRelevant(inn: string, relevant: boolean) {
        try {
            const legal = await this.Model.findOne({'info.inn': inn, relevant: relevant});
            if (!legal) {
                return Result.fail(new RepoError('Legal does not exist', 404));
            }

            return Result.ok(legal);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByOrganizations(organizationIds: string[]) {
        try {
            const legals = await this.Model.find({organization: {$in: organizationIds}});

            return Result.ok(legals);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
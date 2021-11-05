import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationDocument, IOrganizationDocumentModel } from "../../../models/OrganizationDocument";
import { IOrganizationDocumentRepo } from "../IOrganizationDocumentRepo";

export class OrganizationDocumentRepo extends Repo<IOrganizationDocument, IOrganizationDocumentModel> implements IOrganizationDocumentRepo {
    public async findByOrganizationAndType(organizationId: string, type: string) {
        try {
            const organizationDocument = await this.Model.findOne({organization: organizationId, type: type}).sort({updatedAt: -1});
            if (!organizationDocument) {
                return Result.fail(new RepoError('Organization document does not exist', 404));
            }

            return Result.ok(organizationDocument);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByOrganizationAndTypeAndDateFromAndDateTo(organizationId: string, type: string, dateFrom: Date, dateTo: Date) {
        try {
            const organizationDocument = await this.Model.findOne({
                organization: organizationId,
                type: type,
                'options.dateFrom': dateFrom,
                'options.dateTo': dateTo
            });

            if (!organizationDocument) {
                return Result.fail(new RepoError('Organization document', 404));
            }

            return Result.ok(organizationDocument);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByOrganization(organizationId: string, type?: string) {
        try {
            const query: Record<string, any> = {organization: organizationId};

            if (type) {
                query['type'] = type;
            } 

            const organizationDocuments = await this.Model.find(query);

            return Result.ok(organizationDocuments);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IOrganizationDocument } from "../../models/OrganizationDocument";

export interface IOrganizationDocumentRepo extends IRepo<IOrganizationDocument> {
    findByOrganizationAndType(organizationId: string, type: string): RepoResult<IOrganizationDocument>;
    findByOrganizationAndTypeAndDateFromAndDateTo(organizationId: string, type: string, dateFrom: Date, dateTo: Date): RepoResult<IOrganizationDocument>;
    findManyByOrganization(organizationId: string, type?: string): RepoResult<IOrganizationDocument[]>;
};
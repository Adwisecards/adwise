import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { ILegal } from "../../models/Legal";

export interface ILegalRepo extends IRepo<ILegal> {
    findByOrganizationAndRelevant(organizationId: string, relevant: boolean): RepoResult<ILegal>;
    findManyByOrganization(organizationId: string): RepoResult<ILegal[]>;
    findByInnAndRelevant(inn: string, relevant: boolean): RepoResult<ILegal>;
    findManyByOrganizations(organizationIds: string[]): RepoResult<ILegal[]>;
};
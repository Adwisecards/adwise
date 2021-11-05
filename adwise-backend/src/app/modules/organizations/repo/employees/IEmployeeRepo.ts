import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IEmployee } from "../../models/Employee";

export interface IEmployeeRepo extends IRepo<IEmployee> {
    findByUser(userId: string): RepoResult<IEmployee>;
    findByOrganizationAndUser(organizationId: string, userId: string): RepoResult<IEmployee>;
    findByOrganization(organizationId: string, type: string, limit: number, page: number, all: boolean, populate: string): RepoResult<IEmployee[]>;
    setEmployeesDisabledByOrganization(organizationId: string, disabled: boolean): RepoResult<any>;
    findByUserAndDisabledAndRole(userId: string, disabled: boolean, role: string): RepoResult<IEmployee>;
};
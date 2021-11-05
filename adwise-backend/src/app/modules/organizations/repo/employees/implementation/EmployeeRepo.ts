import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IEmployee, IEmployeeModel } from "../../../models/Employee";
import { IEmployeeRepo } from "../IEmployeeRepo";

export class EmployeeRepo extends Repo<IEmployee, IEmployeeModel> implements IEmployeeRepo {
    public async findByUser(userId: string) {
        try {
            const employee = await this.Model.findOne({
                user: userId
            });

            if (!employee) {
                return Result.fail(new RepoError('Employee does not exist', 404));
            }
            
            return Result.ok(employee);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByUserAndDisabledAndRole(userId: string, disabled: boolean, role: string) {
        try {
            const employee = await this.Model.findOne({
                user: userId,
                role: role,
                disabled: disabled
            });

            if (!employee) {
                return Result.fail(new RepoError('Employee does not exist', 404));
            }
            
            return Result.ok(employee);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByOrganizationAndUser(organizationId: string, userId: string) {
        try {
            const employee = await this.Model.findOne({
                user: userId,
                organization: organizationId
            });

            if (!employee) {
                return Result.fail(new RepoError('Employee does not exist', 404));
            }
            
            return Result.ok(employee);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByOrganization(organizationId: string, type: string, limit: number, page: number, all: boolean, populate: string) {
        try {
            const query = {
                organization: organizationId,
                disabled: false
            };

            if (all) {
                delete (<any>query).disabled;
            }

            if (type) {
                (<any>query).type = type;
            }

            const employees = await this.Model.find(query)
                .limit(limit)
                .skip(limit * (page - 1))
                .populate('contact '+populate);
            
            return Result.ok(employees);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async setEmployeesDisabledByOrganization(organizationId: string, disabled: boolean) {
        try {
            const result = await this.Model.updateMany({organization: organizationId}, {$set: {disabled: disabled}});

            return Result.ok(result);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
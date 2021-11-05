import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployeeRepo } from "../../../repo/employees/IEmployeeRepo";
import { getOrganizationErrors } from "../getOrganization/getOrganizationErrors";
import { GetOrganizationEmployeesDTO } from "./GetOrganizationEmployeesDTO";

export class GetOrganizationEmployeesUseCase implements IUseCase<GetOrganizationEmployeesDTO.Request, GetOrganizationEmployeesDTO.Response> {
    private employeeRepo: IEmployeeRepo;
    public errors = [
        ...getOrganizationErrors
    ];

    constructor(employeeRepo: IEmployeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    public async execute(req: GetOrganizationEmployeesDTO.Request): Promise<GetOrganizationEmployeesDTO.Response> {
        if (req.limit < 0 || req.page < 0 || !Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const employeesFound = await this.employeeRepo.findByOrganization(req.organizationId, req.role, req.limit, req.page, req.all, 'user');
        if (employeesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding employees'));
        }

        const employees = employeesFound.getValue()!;

        return Result.ok({employees});
    }
}
import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { GetEmployeesDTO } from "./GetEmployeesDTO";
import { getEmployeesErrors } from "./getEmployeesErrors";

export class GetEmployeesUseCase implements IUseCase<GetEmployeesDTO.Request, GetEmployeesDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    public errors: UseCaseError[] = [
        ...getEmployeesErrors
    ];
    constructor(organizationRepo: IOrganizationRepo) {
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: GetEmployeesDTO.Request): Promise<GetEmployeesDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        let organization = await organizationFound.getValue()!.populate('employees').execPopulate();

        return Result.ok({employees: organization.employees as any});
    }
}
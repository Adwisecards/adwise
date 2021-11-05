import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployeeRepo } from "../../../repo/employees/IEmployeeRepo";
import { IEmployeeValidationService } from "../../../services/employees/employeeValidationService/IEmployeeValidationService";
import { GetEmployeeDTO } from "./GetEmployeeDTO";
import { getEmployeeErrors } from "./getEmployeeErrors";

export class GetEmployeeUseCase implements IUseCase<GetEmployeeDTO.Request, GetEmployeeDTO.Response> {
    private employeeRepo: IEmployeeRepo;
    private employeeValidationService: IEmployeeValidationService;

    public errors = getEmployeeErrors;

    constructor(
        employeeRepo: IEmployeeRepo,
        employeeValidationService: IEmployeeValidationService
    ) {
        this.employeeRepo = employeeRepo;
        this.employeeValidationService = employeeValidationService;
    }

    public async execute(req: GetEmployeeDTO.Request): Promise<GetEmployeeDTO.Response> {
        const valid = this.employeeValidationService.getEmployeeData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const employeeFound = await this.employeeRepo.findById(req.employeeId);
        if (employeeFound.isFailure) {
            return Result.fail(employeeFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding employee') : UseCaseError.create('x'));
        }

        const employee = employeeFound.getValue()!;

        return Result.ok({
            employee
        });
    }
}
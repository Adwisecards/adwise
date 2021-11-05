import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import EmployeeRole from "../../../../../core/static/EmployeeRole";
import { IEmployeeRepo } from "../../../repo/employees/IEmployeeRepo";
import { ChangeEmployeeRoleDTO } from "./ChangeEmployeeRoleDTO";
import { changeEmployeeRoleErrors } from "./changeEmployeeRoleErrors";

export class ChangeEmployeeRoleUseCase implements IUseCase<ChangeEmployeeRoleDTO.Request, ChangeEmployeeRoleDTO.Response> {
    private employeeRepo: IEmployeeRepo;
    public errors: UseCaseError[] = [
        ...changeEmployeeRoleErrors  
    ];
    constructor(employeeRepo: IEmployeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    public async execute(req: ChangeEmployeeRoleDTO.Request): Promise<ChangeEmployeeRoleDTO.Response> {
        if (!Types.ObjectId.isValid(req.employeeId) || !EmployeeRole.isValid(req.role)) {
            return Result.fail(UseCaseError.create('c', 'Employee ID and employee role must be valid'));
        }

        const employeeFound = await this.employeeRepo.findById(req.employeeId);
        if (employeeFound.isFailure) {
            return Result.fail(employeeFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('x'));
        } 

        const employee = employeeFound.getValue()!;
        employee.role = req.role;

        const employeeSaved = await this.employeeRepo.save(employee);
        if (employeeSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving employee'));
        }

        return Result.ok({employeeId: req.employeeId});
    }
}
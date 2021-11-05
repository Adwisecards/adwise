import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployeeRepo } from "../../../repo/employees/IEmployeeRepo";
import { SetEmployeeDisabledDTO } from "./SetEmployeeDisabledDTO";
import { setEmployeeDisabledErrors } from "./setEmployeeDisabledErrors";

export class SetEmployeeDisabledUseCase implements IUseCase<SetEmployeeDisabledDTO.Request, SetEmployeeDisabledDTO.Response> {
    private employeeRepo: IEmployeeRepo;
    public errors = [
        ...setEmployeeDisabledErrors
    ];

    constructor(employeeRepo: IEmployeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    public async execute(req: SetEmployeeDisabledDTO.Request): Promise<SetEmployeeDisabledDTO.Response> {
        if (!Types.ObjectId.isValid(req.employeeId) || typeof req.disabled != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'employeeId or disabled is not valid'));
        }

        const employeeFound = await this.employeeRepo.findById(req.employeeId);
        if (employeeFound.isFailure) {
            return Result.fail(employeeFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding employee') : UseCaseError.create('b', 'Employee does not exist'));
        }

        const employee = employeeFound.getValue()!;
        employee.disabled = req.disabled;

        const employeeSaved = await this.employeeRepo.save(employee);
        if (employeeSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving employee'));
        }

        return Result.ok({employeeId: req.employeeId});
    }
}
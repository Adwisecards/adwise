import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { DeleteContactUseCase } from "../../../../contacts/useCases/contacts/deleteContact/DeleteContactUseCase";
import { IEmployeeRepo } from "../../../repo/employees/IEmployeeRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { DeleteEmployeeDTO } from "./DeleteEmployeeDTO";
import { deleteEmployeeErrors } from "./deleteEmployeeErrors";

export class DeleteEmployeeUseCase implements IUseCase<DeleteEmployeeDTO.Request, DeleteEmployeeDTO.Response> {
    private employeeRepo: IEmployeeRepo;
    private organizationRepo: IOrganizationRepo;
    private deleteContactUseCase: DeleteContactUseCase;
    public errors: UseCaseError[] = [
        ...deleteEmployeeErrors
    ];

    constructor(employeeRepo: IEmployeeRepo, organizationRepo: IOrganizationRepo, deleteContactUseCase: DeleteContactUseCase) {
        this.employeeRepo = employeeRepo;
        this.organizationRepo = organizationRepo;
        this.deleteContactUseCase = deleteContactUseCase;
    }

    public async execute(req: DeleteEmployeeDTO.Request): Promise<DeleteEmployeeDTO.Response> {
        if (!Types.ObjectId.isValid(req.employeeId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const employeeFound = await this.employeeRepo.findById(req.employeeId);
        if (employeeFound.isFailure) {
            return Result.fail(employeeFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding employee') : UseCaseError.create('x'));
        }

        const employee = employeeFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(employee.organization.toHexString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const contactDeleted = await this.deleteContactUseCase.execute({
            contactId: employee.contact.toHexString()
        });

        if (contactDeleted.isFailure) {
            return Result.fail(contactDeleted.getError());
        }

        const contactDeletedData = contactDeleted.getValue()!;

        const employeeDeleted = await this.employeeRepo.deleteById(req.employeeId);
        if (employeeDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting employee'));
        }

        const employeeIndex = organization.employees.findIndex(e => e.toHexString() == contactDeletedData.contactId);
        if (employeeIndex >= 0) {
            organization.employees.splice(employeeIndex, 1);
            const organizationSaved = await this.organizationRepo.save(organization);
            if (organizationSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
            }
        }

        return Result.ok({
            employeeId: req.employeeId
        });
    }
}
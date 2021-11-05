import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IEmployee } from "../../../models/Employee";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { GetOrganizationCashierContactsDTO } from "./GetOrganizationCashierContactsDTO";
import { getOrganizationCashierContactsErrors } from "./getOrganizationCashierContactsErrors";

export class GetOrganizationCashierContactsUseCase implements IUseCase<GetOrganizationCashierContactsDTO.Request, GetOrganizationCashierContactsDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private contactRepo: IContactRepo;

    public errors = getOrganizationCashierContactsErrors;

    constructor(
        organizationRepo: IOrganizationRepo,
        contactRepo: IContactRepo
    ) {
        this.organizationRepo = organizationRepo;
        this.contactRepo = contactRepo;
    }

    public async execute(req: GetOrganizationCashierContactsDTO.Request): Promise<GetOrganizationCashierContactsDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const organizationEmployees = organization.employees;

        const employeeContactsFound = await this.contactRepo.findByIds(organizationEmployees.map(i => i.toString()));
        if (employeeContactsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding employee contacts'));
        }

        const employeeContacts = employeeContactsFound.getValue()!;

        const cashierContacts: IContact[] = [];

        for (const employeeContact of employeeContacts) {
            const populatedEmployeeContact = await employeeContact.populate('employee').execPopulate();

            if (!populatedEmployeeContact.employee || typeof populatedEmployeeContact.employee != 'object') continue;

            if ((<IEmployee>(<any>populatedEmployeeContact.employee)).disabled || 
                (<IEmployee>(<any>populatedEmployeeContact.employee)).role != 'cashier') continue;

            cashierContacts.push(employeeContact);
        }

        return Result.ok({contacts: cashierContacts});
    }
}
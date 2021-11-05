import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IEmployeeRepo } from "../../../repo/employees/IEmployeeRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { RepointDefaultCashierDTO } from "./RepointDefaultCashierDTO";
import { repointDefaultCashierErrors } from "./repointDefaultCashierErrors";

export class RepointDefaultCashierUseCase implements IUseCase<RepointDefaultCashierDTO.Request, RepointDefaultCashierDTO.Response> {
    private employeeRepo: IEmployeeRepo;
    private contactRepo: IContactRepo;
    private organizationRepo: IOrganizationRepo;
    private userRepo: IUserRepo;

    public errors = repointDefaultCashierErrors;

    constructor(employeeRepo: IEmployeeRepo, contactRepo: IContactRepo, organizationRepo: IOrganizationRepo, userRepo: IUserRepo) {
        this.employeeRepo = employeeRepo;
        this.contactRepo = contactRepo;
        this.organizationRepo = organizationRepo;
        this.userRepo = userRepo;
    }

    public async execute(_: RepointDefaultCashierDTO.Request): Promise<RepointDefaultCashierDTO.Response> {
        const organizationsFound = await this.organizationRepo.getAll();
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const organizations = organizationsFound.getValue()!;

        const ids: string[] = [];

        for (const organization of organizations) {
            const organizationDefaultCashierContactFound = await this.contactRepo.findById(organization.defaultCashier.toString());
            if (organizationDefaultCashierContactFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding default cashier contact'));
            }

            const organizationDefaultCashierContact = organizationDefaultCashierContactFound.getValue()!;

            const organizationDefaultCashierEmployeeFound = await this.employeeRepo.findById(organizationDefaultCashierContact.employee.toString());
            if (organizationDefaultCashierEmployeeFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organization default cashier employee'));
            }

            const organizationDefaultCashierEmployee = organizationDefaultCashierEmployeeFound.getValue()!;
            
            const organizationDefaultCashierUserFound = await this.userRepo.findById(organizationDefaultCashierContact.ref.toString());
            if (organizationDefaultCashierUserFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
            }

            const organizationDefaultCashierUser = organizationDefaultCashierUserFound.getValue()!;

            if (organizationDefaultCashierUser.organization) {
                continue;
            }

            const crmUserFound = await this.userRepo.findById(organization.user.toString());
            if (crmUserFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding crm user'));
            }

            const crmUser = crmUserFound.getValue()!;

            if (crmUser._id.toString() == organizationDefaultCashierUser._id.toString()) {
                continue;
            }
            
            organizationDefaultCashierContact.ref = crmUser._id;
            organizationDefaultCashierEmployee.user = crmUser._id;
            
            const organizationDefaultCashierContactIndex = organizationDefaultCashierUser.contacts.findIndex(c => c.toString() == organizationDefaultCashierContact._id.toString());

            if (organizationDefaultCashierContactIndex != 1) {
                organizationDefaultCashierUser.contacts.splice(organizationDefaultCashierContactIndex, 1);
            }

            crmUser.contacts.push(organizationDefaultCashierContact._id);

            const crmUserSaved = await this.userRepo.save(crmUser);
            if (crmUserSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving crm user'));
            }

            const organizationDefaultCashierUserSaved = await this.userRepo.save(organizationDefaultCashierUser);
            if (organizationDefaultCashierUserSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving organization default cashier user'));
            }

            const organizationDefaultCashierContactSaved = await this.contactRepo.save(organizationDefaultCashierContact);
            if (organizationDefaultCashierContactSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving organization default cashier contact'));
            }

            const organizationDefaultCashierEmployeeSaved = await this.employeeRepo.save(organizationDefaultCashierEmployee);
            if (organizationDefaultCashierEmployeeSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving organization default cahsier employee'));
            }

            ids.push(organization._id.toString());
        }

        return Result.ok({ids});
    }
}
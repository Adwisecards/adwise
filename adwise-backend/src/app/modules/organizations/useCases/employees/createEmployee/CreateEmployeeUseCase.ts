import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import EmployeeRole from "../../../../../core/static/EmployeeRole";
import { ContactModel } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { SendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification/SendNotificationUseCase";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { CreateUserNotificationUseCase } from "../../../../users/useCases/userNotifications/createUserNotification/CreateUserNotificationUseCase";
import { EmployeeModel, IEmployee } from "../../../models/Employee";
import { IEmployeeRepo } from "../../../repo/employees/IEmployeeRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { CreateEmployeeDTO } from "./CreateEmployeeDTO";
import { createEmployeeErrors } from "./createEmployeeErrors";

export class CreateEmployeeUseCase implements IUseCase<CreateEmployeeDTO.Request, CreateEmployeeDTO.Response> {
    private contactRepo: IContactRepo;
    private organizationRepo: IOrganizationRepo;
    private employeeRepo: IEmployeeRepo;
    private userRepo: IUserRepo;
    private createRefUseCase: CreateRefUseCase;
    private walletRepo: IWalletRepo;
    private createUserNotificationUseCase: CreateUserNotificationUseCase;
    private sendNotificationUseCase: SendNotificationUseCase;

    public errors = createEmployeeErrors

    constructor(
        contactRepo: IContactRepo, 
        organizationRepo: IOrganizationRepo, 
        employeeRepo: IEmployeeRepo, 
        userRepo: IUserRepo, 
        createRefUseCase: CreateRefUseCase, 
        walletRepo: IWalletRepo,
        createUserNotificationUseCase: CreateUserNotificationUseCase,
        sendNotificationUseCase: SendNotificationUseCase
    ) {
        this.contactRepo = contactRepo;
        this.organizationRepo = organizationRepo;
        this.employeeRepo = employeeRepo;
        this.userRepo = userRepo;
        this.createRefUseCase = createRefUseCase;
        this.walletRepo = walletRepo;
        this.createUserNotificationUseCase = createUserNotificationUseCase;
        this.sendNotificationUseCase = sendNotificationUseCase;
    }

    public async execute(req: CreateEmployeeDTO.Request): Promise<CreateEmployeeDTO.Response> {
        if (!Types.ObjectId.isValid(req.contactId) || !Types.ObjectId.isValid(req.organizationId) || !EmployeeRole.isValid(req.role)) {
            return Result.fail(UseCaseError.create('c', 'Contact ID, organization ID and role must be valid'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('l'));
        }

        const organization = await organizationFound.getValue()!.populate('employees').execPopulate();

        const enabledEmployees = organization.employees.filter((e: any) => !e.disabled);

        if (!req.defaultCashier && (!organization.packet || enabledEmployees.length-2 == organization.packet.limit )) {
            if (!req.defaultCashier) {
                return Result.fail(UseCaseError.create('z'));
            }
        }

        const clientContactFound = await this.contactRepo.findById(req.contactId);
        if (clientContactFound.isFailure) {
            return Result.fail(clientContactFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('w'));
        }

        const clientContact = clientContactFound.getValue()!;

        const userFound = await this.userRepo.findById(clientContact.ref.toHexString());
        if (userFound.isFailure) {
            console.log(3);
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const employeeContact = new ContactModel({
            firstName: {
                custom: false,
                value: clientContact.firstName.value || user.firstName
            },
            lastName: {
                custom: false,
                value: clientContact.lastName.value || user.lastName
            },
            picture: {
                custom: false,
                value: clientContact.picture.value || user.picture
            },
            type: 'work',
            color: organization.colors.primary,
            ref: user._id,
            organization: req.organizationId
        });

        const refCreated = await this.createRefUseCase.execute({
            ref: employeeContact._id,
            mode: 'contact',
            type: 'work'
        });

        if (refCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
        }

        const ref = refCreated.getValue()!;

        employeeContact.requestRef = ref;

        const employeeFound = await this.employeeRepo.findByUserAndDisabledAndRole(user._id, false, 'cashier');
        if (employeeFound.isSuccess) {
            return Result.fail(UseCaseError.create('f', 'User is already employee'));
        }

        const employee = new EmployeeModel(<IEmployee>{
            contact: employeeContact._id,
            organization: organization._id,
            role: req.role,
            user: user._id,
            purchasesInOrganization: {
                sum: 0,
                currency: 'rub'
            },
            refPoints: {
                sum: 0,
                currency: 'rub'
            },
            refPurchases: {
                sum: 0,
                currency: 'rub'
            }
        });

        employeeContact.employee = employee._id;

        organization.employees.push(employeeContact._id);
        user.contacts.push(employeeContact._id);

        employeeContact.subscriptions.push(organization._id);
        organization.clients.push(employeeContact._id);

        if (req.defaultCashier) {
            organization.defaultCashier = employeeContact._id;
        }

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        const employeeSaved = await this.employeeRepo.save(employee);
        if (employeeSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving employee'));
        }

        const employeeContactSaved = await this.contactRepo.save(employeeContact);
        if (employeeContactSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving employee contact'));
        }

        await this.sendNotificationUseCase.execute({
            type: 'employeeCreated',
            values: {
                organizationName: organization.name
            },
            data: {
                organizationId: organization._id.toString()
            },
            receiverIds: [user._id.toString()]
        });

        await this.createUserNotificationUseCase.execute({
            level: 'info',
            type: 'employeeCreated',
            userId: user._id.toString(),
            organizationId: organization._id.toString()
        });

        return Result.ok({
            employeeId: employee._id,
            employeeContactId: employeeContact._id
        });
    }
}
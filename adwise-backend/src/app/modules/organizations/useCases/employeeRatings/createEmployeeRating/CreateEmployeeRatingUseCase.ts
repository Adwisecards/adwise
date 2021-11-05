import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IPurchase } from "../../../../finance/models/Purchase";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IEmployee } from "../../../models/Employee";
import { EmployeeRatingModel } from "../../../models/EmployeeRating";
import { IOrganization } from "../../../models/Organization";
import { IEmployeeRatingRepo } from "../../../repo/employeeRatings/IEmployeeRatingRepo";
import { IEmployeeRepo } from "../../../repo/employees/IEmployeeRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IEmployeeRatingValidationService } from "../../../services/employeeRatings/employeeRatingValidationService/IEmployeeRatingValidationService";
import { CreateEmployeeRatingDTO } from "./CreateEmployeeRatingDTO";
import { createEmployeeRatingErrors } from "./createEmployeeRatingErrors";

interface IKeyObjects {
    employee: IEmployee;
    employeeContact: IContact;
    purchase?: IPurchase;
    purchaserContact: IContact;
    purchaserUser: IUser;
    organization: IOrganization;
};

export class CreateEmployeeRatingUseCase implements IUseCase<CreateEmployeeRatingDTO.Request, CreateEmployeeRatingDTO.Response> {
    private employeeRatingRepo: IEmployeeRatingRepo;
    private employeeRatingValidationService: IEmployeeRatingValidationService;
    private employeeRepo: IEmployeeRepo;
    private contactRepo: IContactRepo;
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private purchaseRepo: IPurchaseRepo;

    public errors = createEmployeeRatingErrors;

    constructor(
        employeeRatingRepo: IEmployeeRatingRepo, 
        employeeRatingValidationService: IEmployeeRatingValidationService, 
        employeeRepo: IEmployeeRepo, 
        contactRepo: IContactRepo, 
        userRepo: IUserRepo, 
        organizationRepo: IOrganizationRepo,
        purchaseRepo: IPurchaseRepo
    ) {
        this.employeeRatingRepo = employeeRatingRepo;
        this.employeeRepo = employeeRepo;
        this.contactRepo = contactRepo;
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.employeeRatingValidationService = employeeRatingValidationService;
        this.purchaseRepo = purchaseRepo;
    }

    public async execute(req: CreateEmployeeRatingDTO.Request): Promise<CreateEmployeeRatingDTO.Response> {
        const valid = this.employeeRatingValidationService.createEmployeeRatingData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!))
        }

        const getKeyObjectsFound = await this.getKeyObjects(
            req.employeeContactId,
            req.purchaserContactId,
            req.purchaserUserId,
            req.purchaseId
        );

        if (getKeyObjectsFound.isFailure) {
            return Result.fail(getKeyObjectsFound.getError()!);
        }

        const {
            employee,
            employeeContact,
            purchase,
            purchaserContact,
            purchaserUser,
            organization
        } = getKeyObjectsFound.getValue()!;
        
        const employeeRating = new EmployeeRatingModel({
            employee: employee._id,
            employeeContact: employeeContact._id,
            purchaserContact: purchaserContact! ? purchaserContact!._id : undefined as any,
            user: purchaserUser! ? purchaserUser!._id : undefined as any,
            organization: organization._id,
            comment: req.comment,
            rating: req.rating,
            purchase: purchase?._id
        });

        if (purchase) {
            purchase.employeeRating = employeeRating._id.toString();
        }

        const employeeRatingSaved = await this.employeeRatingRepo.save(employeeRating);
        if (employeeRatingSaved.isFailure) {
            console.log(employeeRatingSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon saving employee rating'));
        }

        const employeeRatingsFound = await this.employeeRatingRepo.findManyByEmployee(employee._id.toString());
        if (employeeRatingsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding employee ratings'));
        }

        const employeeRatings = employeeRatingsFound.getValue()!;

        const employeeRatingCount = employeeRatings.length;

        const employeeRatingSum = employeeRatings.reduce((sum, cur) => sum += cur.rating, 0);

        const medium = employeeRatingSum / employeeRatingCount;

        employee.rating = Number(medium.toFixed(2));

        const employeeSaved = await this.employeeRepo.save(employee);
        if (employeeSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving employee'));
        }

        if (purchase) {
            const purchaseSaved = await this.purchaseRepo.save(purchase);
            if (purchaseSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
            }
        }

        return Result.ok({employeeRating});
    }

    private async getKeyObjects(employeeContactId: string, purchaserContactId: string, purchaserUserId: string, purchaseId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const employeeContactFound = await this.contactRepo.findById(employeeContactId);
        if (employeeContactFound.isFailure) {
            return Result.fail(employeeContactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding employee contact') : UseCaseError.create ('w', 'Employee contact does not exist'));
        }

        const employeeContact = employeeContactFound.getValue()!;

        const employeeFound = await this.employeeRepo.findById(employeeContact?.employee.toString());
        if (employeeFound.isFailure) {
            return Result.fail(employeeFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding employee') : UseCaseError.create('x'));
        }

        const employee = employeeFound.getValue()!;

        const purchaserContactFound = await this.contactRepo.findById(purchaserContactId);
        if (purchaserContactFound.isFailure) {
            return Result.fail(purchaserContactFound.getError()!.code == 500 ? UseCaseError.create( 'a', 'Error upon finding purchaser contact') : UseCaseError.create('w', 'Purchaser contact does not exist'));
        }

        const purchaserContact = purchaserContactFound.getValue()!;

        const purchaserUserFound = await this.userRepo.findById(purchaserUserId);
        if (purchaserUserFound.isFailure) {
            return Result.fail(purchaserUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchaser user') : UseCaseError.create('m', 'Purchaser user does not exist'));
        }

        const purchaserUser = purchaserUserFound.getValue()!;

        let purchase: IPurchase | undefined;

        if (purchaseId) {
            const purchaseFound = await this.purchaseRepo.findById(purchaseId);
            if (purchaseFound.isFailure) {
                return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
            }

            purchase = purchaseFound.getValue()!;
        }

        const employeeRatingsFound = await this.employeeRatingRepo.findManyByEmployee(employee._id.toString());
        if (employeeRatingsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding employee ratings'));
        }

        const employeeRatings = employeeRatingsFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(employee.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        return Result.ok({
            employee,
            employeeContact,
            purchase,
            purchaserContact,
            purchaserUser,
            employeeRatings,
            organization
        });
    }
}
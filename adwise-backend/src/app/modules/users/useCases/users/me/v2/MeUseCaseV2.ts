import { Types } from "mongoose";
import { IUseCase } from "../../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../../core/models/Result";
import { UseCaseError } from "../../../../../../core/models/UseCaseError";
import { IContact } from "../../../../../contacts/models/Contact";
import { IPurchaseRepo } from "../../../../../finance/repo/purchases/IPurchaseRepo";
import { IEmployee } from "../../../../../organizations/models/Employee";
import { IOrganizationRepo } from "../../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../repo/users/IUserRepo";
import { MeDTOV2 } from "./MeDTOV2";
import { meErrorsV2 } from "./meErrorsV2";

export class MeUseCaseV2 implements IUseCase<MeDTOV2.Request, MeDTOV2.Response> {
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private purchaseRepo: IPurchaseRepo;

    public errors = meErrorsV2;

    constructor(userRepo: IUserRepo, organizationRepo: IOrganizationRepo, purchaseRepo: IPurchaseRepo) {
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.purchaseRepo = purchaseRepo;
    }

    public async execute(req: MeDTOV2.Request): Promise<MeDTOV2.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        if (typeof req.isOrganization != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'isOrganization is not valid'));
        }

        if (typeof req.populateEmployee != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'populateEmployee is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
           return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }
        
        const user = userFound.getValue()!;

        if (!user.organization && req.isOrganization) {
            return Result.fail(UseCaseError.create('c', 'User has no organization'));
        }

        if (req.isOrganization) {
            const organizationFound = await this.organizationRepo.findById(user.organization.toString());
            if (organizationFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organization'))
            }

            const organization = organizationFound.getValue()!;

            const organizationPopulated = await this.organizationRepo.populate(organization, 'manager wallet', '');
            if (organizationPopulated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon populating organization'));
            }

            const populatedOrganization = await organizationPopulated.getValue()!.populate('manager wallet').execPopulate();

            const organizationPurchasesFound = await this.purchaseRepo.findByOrganization(organization._id, 10000000, 1);
            if (organizationPurchasesFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organization purchases'));
            }

            const organizationPurchases = organizationPurchasesFound.getValue()!;

            return Result.ok({organization: (<any>{...populatedOrganization.toObject(), purchaseCount: organizationPurchases.length || 0})});
        }

        const userPopulated = await this.userRepo.populate(user, 'organization contacts.organization contacts.employee.organization contacts contacts.employee account wallet', '');
        if (userPopulated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon populating user'));
        }

        const populatedUser = userPopulated.getValue()!;

        const enabledContacts: IContact[] = [];

        for (const contact of (<IContact[]>(<any>populatedUser.contacts))) {
            if (contact.employee && (<IEmployee>(<any>contact.employee)).disabled) {
                continue;
            }

            if (!req.populateEmployee && contact.employee) {
                contact.employee = (<IEmployee>(<any>contact.employee))._id;
            }

            enabledContacts.push(contact);
        }

        if (req.platform) {
            if (user.platform != req.platform) {
                user.platform = req.platform;

                const userSaved = await this.userRepo.save(user);
                if (userSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
                }
            }
        }

        if (req.language) {
            if (user.language != req.language) {
                user.language = req.language;

                const userSaved = await this.userRepo.save(user);
                if (userSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
                }
            }
        }

        // TEMP

        (<any>populatedUser).wallet.points = (<any>populatedUser).wallet.cashbackPoints + (<any>populatedUser).wallet.bonusPoints;
        (<any>populatedUser).wallet.cashbackPoints = 0;
        (<any>populatedUser).wallet.bonusPoints = 0;

        populatedUser.contacts = enabledContacts as any;

        return Result.ok({user: populatedUser});
    }
}
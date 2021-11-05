import { Types } from "mongoose";
import { platform } from "process";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { MeDTO } from "./MeDTO";
import { meErrors } from "./meErrors";

export class MeUseCase implements IUseCase<MeDTO.Request, MeDTO.Response> {
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private purchaseRepo: IPurchaseRepo;
    public errors: UseCaseError[] = [
        ...meErrors
    ];
    constructor(userRepo: IUserRepo, organizationRepo: IOrganizationRepo, purchaseRepo: IPurchaseRepo) {
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.purchaseRepo = purchaseRepo;
    }

    public async execute(req: MeDTO.Request): Promise<MeDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'))
        }

        let user = userFound.getValue()!;

        if (req.isOrganization) {
            if (!user.organization) {
                return Result.fail(UseCaseError.create('c', 'User does not have organization'));
            }
            const organizationFound = await this.organizationRepo.findById(user.organization.toHexString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
            }

            let organization = await organizationFound.getValue()!.populate('manager').execPopulate();
            organization = await organization.populate('wallet').execPopulate();

            const organizationPurchasesFound = await this.purchaseRepo.findByOrganization(organization._id, 10000000, 1);
            if (organizationPurchasesFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organization purchases'));
            }

            const organizationPurchases = organizationPurchasesFound.getValue()!;

            return Result.ok({organization: (<any>{...organization.toObject(), purchaseCount: organizationPurchases.length || 0})});
        }

        user = await user.populate('contacts wallet').execPopulate();

        (<any>user).wallet.points = (<any>user).wallet.cashbackPoints + (<any>user).wallet.bonusPoints;
        (<any>user).wallet.cashbackPoints = 0;
        (<any>user).wallet.bonusPoints = 0;

        for (let i = 0; i < await user.contacts.length; i++) {
            console.log(i);
            if (!(await <any>user.contacts[i])) continue;

            if ((<any>user.contacts)[i].type == 'work') {
                console.log((<any>user.contacts)[i].employee);

                (<any>user.contacts[i]) = await (<any>user.contacts[i]).populate('organization', 'picture mainPicture name description briefDescription colors').execPopulate();
                (<any>user.contacts[i]) = await (<any>user.contacts[i]).populate('employee').execPopulate();
                if ((<any>user.contacts)[i].employee.disabled) {
                    user.contacts.splice(i as any, 1);
                } else {
                    (<any>user.contacts[i]).employee = (<any>user.contacts[i]).employee._id;
                }
            }
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

        return Result.ok({user});
    }
}

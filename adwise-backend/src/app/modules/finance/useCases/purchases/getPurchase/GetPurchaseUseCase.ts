import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { timeService } from "../../../../../services/timeService";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { CalculatePurchaseMarketingUseCase } from "../calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { GetPurchaseDTO } from "./GetPurchaseDTO";
import { getPurchaseErrors } from "./getPurchaseErrors";

export class GetPurchaseUseCase implements IUseCase<GetPurchaseDTO.Request, GetPurchaseDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private organizationRepo: IOrganizationRepo;
    private walletRepo: IWalletRepo;
    private globalRepo: IGlobalRepo;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;
    private userRepo: IUserRepo;
    private purchaseValidationService: IPurchaseValidationService;
    private contactRepo: IContactRepo;
    
    public errors = [
        ...getPurchaseErrors
    ];

    constructor(
        purchaseRepo: IPurchaseRepo, 
        organizationRepo: IOrganizationRepo, 
        walletRepo: IWalletRepo, 
        globalRepo: IGlobalRepo,
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase,
        userRepo: IUserRepo,
        purchaseValidationService: IPurchaseValidationService,
        contactRepo: IContactRepo
    ) {
        this.purchaseRepo = purchaseRepo;
        this.organizationRepo = organizationRepo;
        this.walletRepo = walletRepo;
        this.globalRepo = globalRepo;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;    
        this.userRepo = userRepo;
        this.purchaseValidationService = purchaseValidationService;
        this.contactRepo = contactRepo;
    }

    public async execute(req: GetPurchaseDTO.Request): Promise<GetPurchaseDTO.Response> {
        const valid = this.purchaseValidationService.getPurchaseData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const contactsFound = await this.contactRepo.findByUserAndType(user._id.toString(), 'work');
        if (contactsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding contacts'));
        }

        const contacts = contactsFound.getValue()!;

        const purchaseFound = await this.purchaseRepo.findById(req.purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('b', 'Purchase does not exist'));
        }

        let purchase = purchaseFound.getValue()!

        const organizationContact = contacts.find(c => (<any>c.organization)._id.toString() == purchase.organization.toString());

        if (purchase.user && purchase.user.toString() != user._id.toString() && !organizationContact) {
            return Result.fail(UseCaseError.create('d', 'User is not cashier or purchaser'));
        }

        purchase = await purchase.populate('cashier organization purchaser').execPopulate();

        const organizationFound = await this.organizationRepo.findById((<any>purchase.organization)._id.toString());
        if (organizationFound.isFailure) {
           return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const walletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        let cashAvailable = false;

        if (purchase.user && purchase.purchaser && !purchase.confirmed) {
            const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({
                purchase: {
                    ...purchase.toObject(),
                    organization: (<any>purchase.organization)._id.toString()
                }
            });
    
            if (purchaseMarketingCalculated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon calculating purchase marketing'));
            }

            const {
                totalSum
            } = purchaseMarketingCalculated.getValue()!;
    
            cashAvailable = (wallet.deposit > totalSum) && organization.cash;
        }

        if (!req.multiple) {
            purchase.offer = purchase.offers[0];
            purchase.coupon = purchase.coupons[0];
        }

        return Result.ok({purchase, cashAvailable});
    }
}

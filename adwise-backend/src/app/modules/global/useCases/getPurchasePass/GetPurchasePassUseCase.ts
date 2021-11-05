import { Types } from "mongoose";
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IWalletService } from "../../../../services/walletService/IWalletService";
import { IPurchaseRepo } from "../../../finance/repo/purchases/IPurchaseRepo";
import { IOrganizationRepo } from "../../../organizations/repo/organizations/IOrganizationRepo";
import { GetPurchasePassDTO } from "./GetPurchasePassDTO";
import { getPurchasePassErrors } from "./getPurchasePassErrors";

export class GetPurchasePassUseCase implements IUseCase<GetPurchasePassDTO.Request, GetPurchasePassDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private organizationRepo: IOrganizationRepo;
    private walletService: IWalletService;

    public errors = getPurchasePassErrors;

    constructor(purchaseRepo: IPurchaseRepo, organizationRepo: IOrganizationRepo, walletService: IWalletService) {
        this.purchaseRepo = purchaseRepo;
        this.organizationRepo = organizationRepo;
        this.walletService = walletService;
    }

    public async execute(req: GetPurchasePassDTO.Request): Promise<GetPurchasePassDTO.Response> {
        if (!Types.ObjectId.isValid(req.purchaseId)) {
            return Result.fail(UseCaseError.create('c', 'purchaseId is not valid'));
        }

        const purchaseFound = await this.purchaseRepo.findById(req.purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        if (!purchase.confirmed) {
            return Result.fail(UseCaseError.create('c', 'Purchase is not confirmed yet'));
        }

        if (purchase.complete) {
            return Result.fail(UseCaseError.create('c', 'Purchase is already complete'));
        }

        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const couponNames = purchase.coupons.reduce((name, cur) => name += cur.name + ' ', '').trim();

        const passGenerated = await this.walletService.generateCouponPass(purchase._id, purchase.ref.code, couponNames, purchase.paidAt || purchase.timestamp, organization.name, purchase.sumInPoints);
        if (passGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating pass'));
        }

        const pass = passGenerated.getValue()!;

        return Result.ok({pass});
    }
}
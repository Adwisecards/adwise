import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { GetUserPurchasesDTO } from "./GetUserPurchasesDTO";
import { getUserPurchasesErrors } from "./getUserPurchasesErrors";

export class GetUserPurchasesUseCase implements IUseCase<GetUserPurchasesDTO.Request, GetUserPurchasesDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private purchaseValidationService: IPurchaseValidationService;
    public errors = [
        ...getUserPurchasesErrors
    ];

    constructor(purchaseRepo: IPurchaseRepo, purchaseValidationService: IPurchaseValidationService) {
        this.purchaseRepo = purchaseRepo;
        this.purchaseValidationService = purchaseValidationService;
    }

    public async execute(req: GetUserPurchasesDTO.Request): Promise<GetUserPurchasesDTO.Response> {
        const valid = this.purchaseValidationService.findUserPurchasesData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        let filter: Record<string, any>[] = [

        ];

        for (const type of req.types!) {
            const filterPass: Record<string, any> = {
                archived: false,
                canceled: false,
                shared: undefined
            };

            if (type == 'new') {
                filterPass.canceled = false
                filterPass.confirmed = false;
                filterPass.complete = false;
                filterPass.processing = false;
            }

            if (type == 'processing') {
                filterPass.canceled = false;
                filterPass.processing = true;
                filterPass.confirmed = false;
                filterPass.complete = false
            }

            if (type == 'confirmed') {
                filterPass.canceled = false;
                filterPass.confirmed = true;
                filterPass.complete = false;
                filterPass.processing = false
            }

            if (type == 'complete') {
                filterPass.canceled = false;
                filterPass.confirmed = true;
                filterPass.complete = true;
                filterPass.processing = false;
            }

            if (type == 'shared') {
                filterPass.shared = true;
                filterPass.complete = false;
            }

            if (type == 'archived') {
                filterPass.archived = true
            }

            if (type == 'canceled') {
                filterPass.canceled = true
            }

            filter.push(filterPass);
        }

        if (!filter.length) {
            filter.push({
                archived: false,
                canceled: false
            });
        }

        const purchasesFound = await this.purchaseRepo.findByUserAndFilter(req.userId, req.limit, req.page, filter, req.dateFrom, req.dateTo, req.refCode, req.organizationName);
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        let purchases = purchasesFound.getValue()!;

        if (!req.multiple) {
            for (const purchase of purchases) {
                purchase.offer = purchase.offers[0];
                purchase.coupon = purchase.coupons[0];
            }
        }

        const purchasesCounted = await this.purchaseRepo.countByUserAndFilter(req.userId, filter, req.dateFrom, req.dateTo, req.refCode, req.organizationName);
        if (purchasesCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting purchases'));
        }

        const count = purchasesCounted.getValue()!;

        return Result.ok({purchases, count});
    }
}
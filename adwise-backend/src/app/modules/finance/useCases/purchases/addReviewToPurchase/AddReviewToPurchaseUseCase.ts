import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { AddReviewToPurchaseDTO } from "./AddReviewToPurchaseDTO";
import { addReviewToPurchaseErrors } from "./addReviewToPurchaseErrors";

export class AddReviewToPurchaseUseCase implements IUseCase<AddReviewToPurchaseDTO.Request, AddReviewToPurchaseDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private purchaseValidationService: IPurchaseValidationService;

    public errors = addReviewToPurchaseErrors;

    constructor(purchaseRepo: IPurchaseRepo, purchaseValidationService: IPurchaseValidationService) {
        this.purchaseRepo = purchaseRepo;
        this.purchaseValidationService = purchaseValidationService;
    }

    public async execute(req: AddReviewToPurchaseDTO.Request): Promise<AddReviewToPurchaseDTO.Response> {
        const valid = this.purchaseValidationService.addReviewToPurchaseData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const purchaseFound = await this.purchaseRepo.findById(req.purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        if (!purchase.complete) {
            return Result.fail(UseCaseError.create('c', 'Purchase is not complete'));
        }

        if (req.review && purchase.review != '') {
            return Result.fail(UseCaseError.create('c', 'Review is already added'));
        }

        if (req.rating && purchase.rating != 0) {
            return Result.fail(UseCaseError.create('c', 'Rating is already added'));
        }

        purchase.review = req.review || '';
        purchase.rating = req.rating || 0;

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        return Result.ok({purchaseId: purchase._id});
    }
}
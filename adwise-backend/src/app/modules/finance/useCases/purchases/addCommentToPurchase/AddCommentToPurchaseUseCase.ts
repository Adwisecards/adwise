import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { AddCommentToPurchaseDTO } from "./AddCommentToPurchaseDTO";
import { addCommentToPurchaseErrors } from "./addCommentToPurchaseErrors";

export class AddCommentToPurchaseUseCase implements IUseCase<AddCommentToPurchaseDTO.Request, AddCommentToPurchaseDTO.Response> {
    private purchaseRepo: IPurchaseRepo;

    public errors = addCommentToPurchaseErrors;

    constructor(purchaseRepo: IPurchaseRepo) {
        this.purchaseRepo = purchaseRepo;
    }

    public async execute(req: AddCommentToPurchaseDTO.Request): Promise<AddCommentToPurchaseDTO.Response> {
        if (!Types.ObjectId.isValid(req.purchaseId)) {
            return Result.fail(UseCaseError.create('c', 'purchaseId is not valid'));
        }

        if (!req.comment) {
            return Result.fail(UseCaseError.create('c', 'comment is not valid'));
        }

        const purchaseFound = await this.purchaseRepo.findById(req.purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        if (purchase.complete) {
            return Result.fail(UseCaseError.create('c', 'Purchase is already complete'));
        }

        purchase.comment = req.comment;

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        return Result.ok({purchaseId: purchase._id});
    }
}
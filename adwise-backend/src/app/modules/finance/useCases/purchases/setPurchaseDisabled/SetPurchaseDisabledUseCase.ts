import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import LogType from "../../../../../core/static/LogType";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { SetPurchaseDisabledDTO } from "./SetPurchaseDisabledDTO";
import { setPurchaseDisabledErrors } from "./setPurchaseDisabledErrors";

export class SetPurchaseDisabledUseCase implements IUseCase<SetPurchaseDisabledDTO.Request, SetPurchaseDisabledDTO.Response> {
    private purchaseRepo: IPurchaseRepo;

    public errors = setPurchaseDisabledErrors;

    constructor(purchaseRepo: IPurchaseRepo) {
        this.purchaseRepo = purchaseRepo;
    }

    public async execute(req: SetPurchaseDisabledDTO.Request): Promise<SetPurchaseDisabledDTO.Response> {
        if (!Types.ObjectId.isValid(req.purchaseId)) {
            return Result.fail(UseCaseError.create('c', 'purchaseId is not valid'));
        }

        if (typeof req.disabled != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'disabled is not valid'));
        }

        const purchaseFound = await this.purchaseRepo.findById(req.purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        purchase.disabled = req.disabled;

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        return Result.ok({purchaseId: req.purchaseId});
    }
}
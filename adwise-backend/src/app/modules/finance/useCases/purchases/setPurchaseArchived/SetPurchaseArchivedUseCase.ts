import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchase } from "../../../models/Purchase";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { SetPurchaseArchivedDTO } from "./SetPurchaseArchivedDTO";
import { setPurchaseArchivedErrors } from "./setPurchaseArchivedErrors";

interface IKeyObjects {
    user: IUser;
    purchase: IPurchase;
};

export class SetPurchaseArchivedUseCase implements IUseCase<SetPurchaseArchivedDTO.Request, SetPurchaseArchivedDTO.Response> {
    private userRepo: IUserRepo;
    private purchaseRepo: IPurchaseRepo;
    private purchaseValidationService: IPurchaseValidationService;

    public errors = setPurchaseArchivedErrors;

    constructor(
        userRepo: IUserRepo,
        purchaseRepo: IPurchaseRepo,
        purchaseValidationService: IPurchaseValidationService
    ) {
        this.userRepo = userRepo;
        this.purchaseRepo = purchaseRepo;
        this.purchaseValidationService = purchaseValidationService
    }

    public async execute(req: SetPurchaseArchivedDTO.Request): Promise<SetPurchaseArchivedDTO.Response> {
        const valid = this.purchaseValidationService.setPurchaseArchivedData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.purchaseId, req.userId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            purchase,
            user
        } = keyObjectsGotten.getValue()!;

        if (purchase.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not purchaser'));
        }

        if (purchase.processing) {
            return Result.fail(UseCaseError.create('c', 'Purchase is in process'));
        }

        if (purchase.confirmed && !purchase.complete) {
            return Result.fail(UseCaseError.create('c', 'Purchase is not completed yet'));
        }

        purchase.archived = req.archived;

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        return Result.ok({
            purchaseId: req.purchaseId
        });
    }

    private async getKeyObjects(purchaseId: string, userId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const purchaseFound = await this.purchaseRepo.findById(purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('l'));
        }

        const user = userFound.getValue()!;

        return Result.ok({
            purchase,
            user
        });
    }
}
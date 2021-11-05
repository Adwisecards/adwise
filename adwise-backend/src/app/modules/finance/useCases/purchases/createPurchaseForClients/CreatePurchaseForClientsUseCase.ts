import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { PurchaseValidationService } from "../../../services/purchases/purchaseValidationService/implementation/PurchaseValidationService";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { CreatePurchaseUseCase } from "../createPurchase/CreatePurchaseUseCase";
import { CreatePurchaseForClientsDTO } from "./CreatePurchaseForClientsDTO";
import { createPurchaseForClientsErrors } from "./createPurchaseForClientsErrors";

export class CreatePurchaseForClientsUseCase implements IUseCase<CreatePurchaseForClientsDTO.Request, CreatePurchaseForClientsDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private createPurchaseUseCase: CreatePurchaseUseCase;
    private purchaseValidationService: IPurchaseValidationService;

    public errors = createPurchaseForClientsErrors;

    constructor(
        purchaseRepo: IPurchaseRepo,
        createPurchaseUseCase: CreatePurchaseUseCase,
        purchaseValidationService: PurchaseValidationService
    ) {
        this.purchaseRepo = purchaseRepo;
        this.createPurchaseUseCase = createPurchaseUseCase;
        this.purchaseValidationService = purchaseValidationService;
    }

    public async execute(req: CreatePurchaseForClientsDTO.Request): Promise<CreatePurchaseForClientsDTO.Response> {
        const valid = this.purchaseValidationService.createPurchaseForClientsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const purchaseIds: string[] = [];

        for (const purchaserContactId of req.purchaserContactIds) {
            console.log(purchaserContactId);
            const purchaseCreated = await this.createPurchaseUseCase.execute({
                cashierContactId: req.cashierContactId,
                coupons: req.coupons,
                description: req.description,
                purchaserContactId: purchaserContactId,
                asOrganization: true,
                userId: req.userId
            });

            if (purchaseCreated.isFailure) {
                console.log(purchaseCreated.getError());
                await this.purchaseRepo.deleteByIds(purchaseIds);
                return Result.fail(purchaseCreated.getError());
            }

            const { purchaseId } = purchaseCreated.getValue()!;

            purchaseIds.push(purchaseId);
        }

        return Result.ok({purchaseIds});
    }
}
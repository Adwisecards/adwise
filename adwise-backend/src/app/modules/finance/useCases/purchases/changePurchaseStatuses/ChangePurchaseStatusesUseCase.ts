import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { SendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification/SendNotificationUseCase";
import { CreateOrganizationNotificationUseCase } from "../../../../organizations/useCases/organizationNotifications/createOrganizationNotification/CreateOrganizationNotificationUseCase";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ChangePurchaseStatusesDTO } from "./ChangePurchaseStatusesDTO";
import { changePurchaseStatusesErrors } from "./changePurchaseStatusesErrors";

export class ChangePurchaseStatusesUseCase implements IUseCase<ChangePurchaseStatusesDTO.Request, ChangePurchaseStatusesDTO.Response> {
    private userRepo: IUserRepo;
    private contactRepo: IContactRepo;
    private purchaseRepo: IPurchaseRepo;
    private sendNotificationUseCase: SendNotificationUseCase;
    private createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase;

    public errors = changePurchaseStatusesErrors;

    constructor(
        userRepo: IUserRepo,
        contactRepo: IContactRepo,
        purchaseRepo: IPurchaseRepo,
        sendNotificationUseCase: SendNotificationUseCase,
        createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase
    ) {
        this.userRepo = userRepo;
        this.contactRepo = contactRepo;
        this.purchaseRepo = purchaseRepo;
        this.sendNotificationUseCase = sendNotificationUseCase;
        this.createOrganizationNotificationUseCase = createOrganizationNotificationUseCase;
    }

    public async execute(_: ChangePurchaseStatusesDTO.Request): Promise<ChangePurchaseStatusesDTO.Response> {
        const purchasesGotten = await this.purchaseRepo.getAll()!;
        if (purchasesGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const purchases = purchasesGotten.getValue()!;

        //const processingPurchases = purchases.filter(p => p.processing == true);

        for (const purchase of purchases) {
            const cashierContactFound = await this.contactRepo.findById(purchase.cashier.toString());
            if (cashierContactFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding contact'));
            }

            const cashierContact = cashierContactFound.getValue()!;

            const cashierUserFound = await this.userRepo.findById(cashierContact.ref.toString());
            if (cashierUserFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
            }

            const cashierUser = cashierUserFound.getValue()!;

            const lifetime = new Date().getTime() - (purchase.lastPaymentAt || purchase.timestamp).getTime();

            if (lifetime > 259200000 && !purchase.confirmed) {
                purchase.archived = true;
            }
            
            if (lifetime > 1.2e+6 && purchase.processing) {
                purchase.processing = false;
            }
            
            if (lifetime > 259200000 && purchase.confirmed && !purchase.complete) {
                await this.createOrganizationNotificationUseCase.execute({
                    organizationId: purchase.organization.toString(),
                    type: 'purchaseIncomplete',
                    purchaseId: purchase._id.toString()
                });

                await this.sendNotificationUseCase.execute({
                    type: 'purchaseIncomplete',
                    receiverIds: [cashierUser._id.toString()],
                    values: {
                        purchaseCode: purchase.ref.code
                    },
                    data: {
                        purchaseId: purchase._id.toString()
                    }
                });
            }

            const purchaseSaved = await this.purchaseRepo.save(purchase);
            if (purchaseSaved.isFailure) {
                continue;
            }
        }

        return Result.ok({});
    }
}
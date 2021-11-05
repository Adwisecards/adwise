import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotificationService } from "../../../../../services/notificationService/INotificationService";
import { IContact } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IEventListenerService } from "../../../../global/services/eventListenerService/IEventListenerService";
import { SendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification/SendNotificationUseCase";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchase } from "../../../models/Purchase";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { SharePurchaseDTO } from "./SharePurchaseDTO";
import { sharePurchaseErrors } from "./sharePurchaseErrors";

interface IKeyObjects {
    purchase: IPurchase;
    receiverContact: IContact;
    receiverUser: IUser;
    sharingUser: IUser;
    sharingContact: IContact;
};

export class SharePurchaseUseCase implements IUseCase<SharePurchaseDTO.Request, SharePurchaseDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private contactRepo: IContactRepo;
    private userRepo: IUserRepo;
    private purchaseValidationService: IPurchaseValidationService;
    private eventListenerService: IEventListenerService;
    private sendNotificationUseCase: SendNotificationUseCase;

    public errors = sharePurchaseErrors;

    constructor(
        purchaseRepo: IPurchaseRepo, 
        contactRepo: IContactRepo, 
        userRepo: IUserRepo, 
        purchaseValidationService: IPurchaseValidationService,
        eventListenerService: IEventListenerService,
        sendNotificationUseCase: SendNotificationUseCase
    ) {
        this.purchaseRepo = purchaseRepo;
        this.contactRepo = contactRepo;
        this.userRepo = userRepo;
        this.purchaseValidationService = purchaseValidationService;
        this.eventListenerService = eventListenerService;
        this.sendNotificationUseCase = sendNotificationUseCase;
    }

    public async execute(req: SharePurchaseDTO.Request): Promise<SharePurchaseDTO.Response> {
        const valid = this.purchaseValidationService.sharePurchaseData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.purchaseId, req.receiverContactId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            purchase,
            receiverContact,
            receiverUser,
            sharingUser,
            sharingContact
        } = keyObjectsGotten.getValue()!;

        if (!purchase.confirmed) {
            return Result.fail(UseCaseError.create('c', 'Purchase is not confirmed'));
        }

        if (purchase.complete) {
            return Result.fail(UseCaseError.create('c', 'Purchase is already completed'));
        }

        if (purchase.shared) {
            return Result.fail(UseCaseError.create('c', 'It\'s not allowed to share a shared purchase'));
        }

        purchase.user = receiverUser._id;

        purchase.purchaser = receiverContact._id;

        purchase.shared = true;

        purchase.sharedAt = new Date();

        purchase.sharingContact = sharingContact._id;

        purchase.sharingUser = sharingUser._id;

        const purchaseIndex = sharingUser.purchases.findIndex(i => i.toString() == purchase._id.toString());
        if (purchaseIndex != -1) {
            sharingUser.purchases.splice(purchaseIndex, 1);
        }

        receiverUser.purchases.push(purchase._id);

        const sharingUserSaved = await this.userRepo.save(sharingUser);
        if (sharingUserSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving sharing user'));
        }

        const receiverUserSaved = await this.userRepo.save(receiverUser);
        if (receiverUserSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving receiver user'));
        }

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        await this.sideEffects(receiverUser, sharingUser, purchase);

        return Result.ok({purchaseId: req.purchaseId});
    }

    private async sideEffects(receiverUser: IUser, sharingUser: IUser, purchase: IPurchase): Promise<Result<true | null, UseCaseError | null>> {
        await this.sendNotificationUseCase.execute({
            type: 'purchaseShared',
            receiverIds: [receiverUser._id.toString()],
            values: {
                sharingUserName: `${sharingUser.firstName}${sharingUser.lastName ? ' '+sharingUser.lastName : ''}`
            },
            data: {
                purchaseId: purchase._id
            }
        });

        this.eventListenerService.dispatchEvent({
            id: receiverUser._id,
            subject: purchase._id,
            type: 'purchaseShared'
        });

        this.eventListenerService.dispatchEvent({
            id: sharingUser._id,
            subject: purchase._id,
            type: 'purchaseShared'
        });

        return Result.ok(true);
    }

    private async getKeyObjects(purchaseId: string, receiverContactId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const purchaseFound = await this.purchaseRepo.findById(purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        const receiverContactFound = await this.contactRepo.findById(receiverContactId);
        if (receiverContactFound.isFailure) {
            return Result.fail(receiverContactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding receiver contact') : UseCaseError.create('w'));
        }

        const receiverContact = receiverContactFound.getValue()!;

        const receiverUserFound = await this.userRepo.findById(receiverContact.ref.toString());
        if (receiverUserFound.isFailure) {
            return Result.fail(receiverUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding receiver user') : UseCaseError.create('m'))
        }

        const receiverUser = receiverUserFound.getValue()!;

        const sharingUserFound = await this.userRepo.findById(purchase.user.toString());
        if (sharingUserFound.isFailure) {
            return Result.fail(sharingUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding sharing user') : UseCaseError.create('m'));
        }

        const sharingUser = sharingUserFound.getValue()!;

        const sharingContactFound = await this.contactRepo.findById(purchase.purchaser.toString());
        if (sharingContactFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding sharing contact'));
        }

        const sharingContact = sharingContactFound.getValue()!;

        return Result.ok({
            purchase,
            receiverContact,
            receiverUser,
            sharingUser,
            sharingContact
        });
    }
}
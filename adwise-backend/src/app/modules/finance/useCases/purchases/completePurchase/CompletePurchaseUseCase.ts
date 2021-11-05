import { Types } from "mongoose";
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
import { IPayment } from "../../../models/Payment";
import { IPurchase } from "../../../models/Purchase";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ConfirmPaymentUseCase } from "../../payments/confirmPayment/ConfirmPaymentUseCase";
import { CompletePurchaseDTO } from "./CompletePurchaseDTO";
import { completePurchaseErrors } from "./completePurchaseErrors";

interface IKeyObjects {
    purchase: IPurchase;
    cashierContact?: IContact;
    payment: IPayment;
    user: IUser;
};

export class CompletePurchaseUseCase implements IUseCase<CompletePurchaseDTO.Request, CompletePurchaseDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private contactRepo: IContactRepo;
    private paymentRepo: IPaymentRepo;
    private userRepo: IUserRepo;
    private sendNotificationUseCase: SendNotificationUseCase;
    private eventListenerService: IEventListenerService;

    public errors = [
        ...completePurchaseErrors
    ];

    constructor(
        purchaseRepo: IPurchaseRepo, 
        contactRepo: IContactRepo, 
        paymentRepo: IPaymentRepo,
        userRepo: IUserRepo,
        eventListenerService: IEventListenerService,
        sendNotificationUseCase: SendNotificationUseCase
    ) {
        this.purchaseRepo = purchaseRepo;
        this.contactRepo = contactRepo;
        this.paymentRepo = paymentRepo;
        this.userRepo = userRepo;
        this.eventListenerService = eventListenerService;
        this.sendNotificationUseCase = sendNotificationUseCase;
    }

    public async execute(req: CompletePurchaseDTO.Request): Promise<CompletePurchaseDTO.Response> {
        if (!Types.ObjectId(req.purchaseId)) {
            return Result.fail(UseCaseError.create('c', 'purchaseId is not valid'));
        }

        if (req.cashierContactId && !Types.ObjectId(req.cashierContactId)) {
            return Result.fail(UseCaseError.create('c', 'cashierContactId is not valid'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.purchaseId, req.cashierContactId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            purchase,
            cashierContact,
            payment,
            user
        } = keyObjectsGotten.getValue()!;
        
        
        if (cashierContact) {
            purchase.cashier = cashierContact._id;
        }
        
        purchase.complete = true;

        purchase.completedAt = new Date();

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        await this.sideEffects(purchase, cashierContact!, user);

        return Result.ok({purchaseId: purchase._id});
    }

    private async sideEffects(purchase: IPurchase, cashierContact: IContact, user: IUser): Promise<Result<true | null, UseCaseError | null>> {
        await this.sendNotificationUseCase.execute({
            receiverIds: [user._id.toString()],
            values: {

            },
            type: 'purchaseCompleted',
            data: {
                purchaseId: purchase._id.toString()
            }
        });

        this.eventListenerService.dispatchEvent({
            id: user._id.toString(),
            subject: purchase._id.toString(),
            type: 'purchaseCompleted'
        });

        if (cashierContact && cashierContact.ref) {
            this.eventListenerService.dispatchEvent({
                id: cashierContact.ref.toString(),
                subject: cashierContact._id.toString(),
                type: 'purchaseCompleted'
            });
        }

        return Result.ok(true);
    }

    private async getKeyObjects(purchaseId: string, cashierContactId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const purchaseFound = await this.purchaseRepo.findById(purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('b', 'Purchase does not exist'));
        }

        const purchase = purchaseFound.getValue()!;

        if (!purchase.payment) {
            return Result.fail(UseCaseError.create('c', 'Purchase has no payment'));
        }

        const paymentFound = await this.paymentRepo.findById(purchase.payment.toString());
        if (paymentFound.isFailure) {
            return Result.fail(paymentFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding payment") : UseCaseError.create('4'));
        }

        const payment = paymentFound.getValue()!;

        let cashierContact: IContact;

        if (cashierContactId) {
            const cashierContactFound = await this.contactRepo.findById(cashierContactId);
            if (cashierContactFound.isFailure) {
                return Result.fail(cashierContactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding cashier contact') : UseCaseError.create('w'));
            }

            cashierContact = cashierContactFound.getValue()!;
        }

        const userFound = await this.userRepo.findById(purchase.user.toString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        return Result.ok({
            purchase,
            cashierContact: cashierContact!,
            payment,
            user
        });
    }
}
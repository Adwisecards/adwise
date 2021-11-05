import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotificationService } from "../../../../../services/notificationService/INotificationService";
import { IContact } from "../../../../contacts/models/Contact";
import { IEventListenerService } from "../../../../global/services/eventListenerService/IEventListenerService";
import { SendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification/SendNotificationUseCase";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { CreatePurchaseAsUserDTO } from './CreatePurchaseAsUserDTO';
import { createPurchaseAsUserErrors } from "./createPurchaseAsUserErrors";

export class CreatePurchaseAsUserUseCase implements IUseCase<CreatePurchaseAsUserDTO.Request, CreatePurchaseAsUserDTO.Response> {
    private userRepo: IUserRepo;
    private purchaseRepo: IPurchaseRepo;
    private eventListenerService: IEventListenerService;
    private sendNotificationUseCase: SendNotificationUseCase;

    public errors = [
        ...createPurchaseAsUserErrors
    ];

    constructor(
        userRepo: IUserRepo, 
        purchaseRepo: IPurchaseRepo, 
        eventListenerService: IEventListenerService,
        sendNotificationUseCase: SendNotificationUseCase
    ) {
        this.userRepo = userRepo;
        this.purchaseRepo = purchaseRepo;
        this.eventListenerService = eventListenerService;
        this.sendNotificationUseCase = sendNotificationUseCase;
    }

    public async execute(req: CreatePurchaseAsUserDTO.Request): Promise<CreatePurchaseAsUserDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        if (!Types.ObjectId.isValid(req.purchaserContactId)) {
            return Result.fail(UseCaseError.create('c', 'purchaserContactId is not valid'));
        }

        if (!Types.ObjectId.isValid(req.purchaseId)) {
            return Result.fail(UseCaseError.create('c', 'purchaseId is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const purchaseFound = await this.purchaseRepo.findById(req.purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = await purchaseFound.getValue()!.populate('cashier').execPopulate();

        if (purchase.user || purchase.purchaser) {
            return Result.fail(UseCaseError.create('c', 'Purchase is already bound to user'));
        }

        user.purchases.push(purchase._id);
        // user.logs.unshift({
        //     ref: purchase._id,
        //     type: 'purchaseCreated',
        //     timestamp: new Date()
        // });

        purchase.user = user._id;
        purchase.purchaser = new Types.ObjectId(req.purchaserContactId);

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        await this.sendNotificationUseCase.execute({
            type: 'purchaseCreated',
            receiverIds: [user._id.toString()],
            values: {
                sumInPoints: purchase.sumInPoints
            },
            data: {
                purchaseId: purchase._id
            }
        });

        this.eventListenerService.dispatchEvent({
            id: user._id.toString(),
            subject: purchase._id,
            type: 'purchaseAdded'
        });

        this.eventListenerService.dispatchEvent({
            id: (<IContact>(<any>purchase.cashier)).ref.toString(),
            subject: purchase._id,
            type: 'purchaseAdded'
        });

        return Result.ok({purchaseId: req.purchaseId});
    }
}

import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICurrencyService } from "../../../../../services/currencyService/ICurrencyService";
import { logger } from "../../../../../services/logger";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IClientRepo } from "../../../../organizations/repo/clients/IClientRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { CreateCashPaymentUseCase } from "../../payments/createCashPayment/CreateCashPaymentUseCase";
import { AddCommentToPurchaseUseCase } from "../addCommentToPurchase/AddCommentToPurchaseUseCase";
import { payPurchaseErrors } from "../payPurchase/payPurchaseErrors";
import { PayPurchaseWithCashDTO } from "./PayPurchaseWithCashDTO";

export class PayPurchaseWithCashUseCase implements IUseCase<PayPurchaseWithCashDTO.Request, PayPurchaseWithCashDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private createCashPaymentUseCase: CreateCashPaymentUseCase;
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private currencyService: ICurrencyService;
    private globalRepo: IGlobalRepo;
    private organizationRepo: IOrganizationRepo;
    private clientRepo: IClientRepo;
    private purchaseValidationService: IPurchaseValidationService;
    private addCommentToPurchaseUseCase: AddCommentToPurchaseUseCase;

    public errors = payPurchaseErrors;

    constructor(
        purchaseRepo: IPurchaseRepo,
        createCashPaymentUseCase: CreateCashPaymentUseCase, 
        userRepo: IUserRepo, 
        walletRepo: IWalletRepo, 
        currencyService: ICurrencyService,
        globalRepo: IGlobalRepo,
        organizationRepo: IOrganizationRepo,
        clientRepo: IClientRepo,
        purchaseValidationService: IPurchaseValidationService,
        addCommentToPurchaseUseCase: AddCommentToPurchaseUseCase
    ) {
        this.purchaseRepo = purchaseRepo;
        this.createCashPaymentUseCase = createCashPaymentUseCase;
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.currencyService = currencyService;
        this.globalRepo = globalRepo;
        this.organizationRepo = organizationRepo;
        this.clientRepo = clientRepo;
        this.purchaseValidationService = purchaseValidationService;
        this.addCommentToPurchaseUseCase = addCommentToPurchaseUseCase;
    }

    public async execute(req: PayPurchaseWithCashDTO.Request): Promise<PayPurchaseWithCashDTO.Response> {
        const valid = this.purchaseValidationService.payPurchaseData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        req.usedPoints = Math.floor(req.usedPoints);

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        if (!global.organization) {
            return Result.fail(UseCaseError.create('c', 'There is no global organization'));
        }

        const purchaseFound = await this.purchaseRepo.findById(req.purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('u'));
        }

        const purchase = purchaseFound.getValue()!;

        if (purchase.confirmed) {
            return Result.fail(UseCaseError.create('c', 'Purchase has already been paid'));
        }

        if (purchase.archived) {
            return Result.fail(UseCaseError.create('c', 'Purchase is archived'));
        }

        if (purchase.canceled) {
            return Result.fail(UseCaseError.create('c', 'Purchase is canceled'));
        }

        if (req.comment) {
            const commentAddedToPurchase = await this.addCommentToPurchaseUseCase.execute({
                comment: req.comment,
                purchaseId: req.purchaseId
            });

            if (commentAddedToPurchase.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon adding comment to purchase'));
            }
        }

        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'))
        }

        const organization = organizationFound.getValue()!;

        if (!organization.cash) {
            return Result.fail(UseCaseError.create('c', 'Organization is not allowed to receive cash payments'));
        }

        if (organization.disabled) {
            return Result.fail(UseCaseError.create('c', 'Organization is disabled'));
        }

        const userFound = await this.userRepo.findById(purchase.user.toHexString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const clientFound = await this.clientRepo.findByOrganizationAndUser(organization._id.toString(), user._id.toString());
        if (clientFound.isFailure) {
            return Result.fail(UseCaseError.create('c', 'User is not a client'));
        }

        const client = clientFound.getValue()!;

        if (client.disabled) {
            return Result.fail(UseCaseError.create('c', 'User is not a client'));
        }

        const walletFound = await this.walletRepo.findById(user.wallet.toHexString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        if (((wallet.points + wallet.bonusPoints + wallet.cashbackPoints) < req.usedPoints) && req.usedPoints > 0) {
            return Result.fail(UseCaseError.create('t'));
        }

        let purchaseSum = purchase.sumInPoints;
        if (wallet.currency != purchase.currency) {
            const exchangeMade = await this.currencyService.exchange(purchase.currency, wallet.currency);
            if (exchangeMade.isFailure) {
                return Result.fail(UseCaseError.create('a', `Error in the process of exchange of ${purchase.currency} and ${wallet.currency}`));
            }

            const exchange = exchangeMade.getValue()!;
            purchaseSum = exchange * purchase.sumInPoints;
        }

        purchaseSum -= req.usedPoints;

        if (purchaseSum == 0) {
            purchaseSum = 1;
            req.usedPoints--;
        }

        purchase.usedPoints = req.usedPoints;

        let purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            console.log(purchaseSaved);
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        const paymentCreated = await this.createCashPaymentUseCase.execute({
            currency: wallet.currency,
            ref: purchase._id.toString(),
            sum: purchaseSum,
            type: 'purchase',
            usedPoints: req.usedPoints
        });

        if (paymentCreated.isFailure) {
            return Result.fail(paymentCreated.getError());
        }

        const { payment } = paymentCreated.getValue()!;
        purchase.processing = true;

        purchase.type = 'cash';

        purchase.payment = payment._id;

        purchase.lastPaymentAt = new Date();

        purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        logger.httpWithMeta('Payment created', {
            purchase: purchase,
            payment: payment
        });
        
        return Result.ok({payment});
    }
}
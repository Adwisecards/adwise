import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICurrencyService } from "../../../../../services/currencyService/ICurrencyService";
import { logger } from "../../../../../services/logger";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { ILegal } from "../../../../legal/models/Legal";
import { ILegalRepo } from "../../../../legal/repo/legal/ILegalRepo";
import { IClient } from "../../../../organizations/models/Client";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IClientRepo } from "../../../../organizations/repo/clients/IClientRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchase } from "../../../models/Purchase";
import { IWallet } from "../../../models/Wallet";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { CreatePaymentUseCase } from "../../payments/createPayment/CreatePaymentUseCase";
import { AddCommentToPurchaseUseCase } from "../addCommentToPurchase/AddCommentToPurchaseUseCase";
import { PayPurchaseDTO } from "./PayPurchaseDTO";
import { payPurchaseErrors } from "./payPurchaseErrors";

interface IKeyObjects {
    purchase: IPurchase;
    organization: IOrganization;
    organizationUser: IUser;
    user: IUser;
    userWallet: IWallet;
    global: IGlobal;
    client?: IClient;
    legal: ILegal;
};

export class PayPurchaseUseCase implements IUseCase<PayPurchaseDTO.Request, PayPurchaseDTO.Response> {
    private userRepo: IUserRepo;
    private createPaymentUseCase: CreatePaymentUseCase;
    private purchaseRepo: IPurchaseRepo;
    private walletRepo: IWalletRepo;
    private currencyService: ICurrencyService;
    private organizationRepo: IOrganizationRepo;
    private globalRepo: IGlobalRepo;
    private clientRepo: IClientRepo;
    private purchaseValidationService: IPurchaseValidationService;
    private addCommentToPurchaseUseCase: AddCommentToPurchaseUseCase;
    private legalRepo: ILegalRepo;

    public errors = payPurchaseErrors;

    constructor(
        userRepo: IUserRepo,
        createPaymentUseCase: CreatePaymentUseCase,
        purchaseRepo: IPurchaseRepo,
        walletRepo: IWalletRepo,
        currencyService: ICurrencyService,
        organizationRepo: IOrganizationRepo,
        globalRepo: IGlobalRepo,
        clientRepo: IClientRepo,
        purchaseValidationService: IPurchaseValidationService,
        addCommentToPurchaseUseCase: AddCommentToPurchaseUseCase,
        legalRepo: ILegalRepo
    ) {
        this.createPaymentUseCase = createPaymentUseCase;
        this.userRepo = userRepo;
        this.purchaseRepo = purchaseRepo;
        this.walletRepo = walletRepo;
        this.currencyService = currencyService;
        this.organizationRepo = organizationRepo;
        this.globalRepo = globalRepo;
        this.clientRepo = clientRepo;
        this.purchaseValidationService = purchaseValidationService;
        this.addCommentToPurchaseUseCase = addCommentToPurchaseUseCase;
        this.legalRepo = legalRepo;
    }

    public async execute(req: PayPurchaseDTO.Request): Promise<PayPurchaseDTO.Response> {
        const valid = this.purchaseValidationService.payPurchaseData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsFound = await this.getKeyObjects(req.purchaseId);
        if (keyObjectsFound.isFailure) {
            return Result.fail(keyObjectsFound.getError()!);
        }

        const {
            global,
            organization,
            organizationUser,
            purchase,
            user,
            userWallet,
            client,
            legal
        } = keyObjectsFound.getValue()!;

        req.usedPoints = Math.floor(req.usedPoints);

        if (!global.organization) {
            return Result.fail(UseCaseError.create('c', 'There is no global organization'));
        }
        
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

        if (!organization.online) {
            return Result.fail(UseCaseError.create('c', 'Organization is not allowed to receive online payments'));
        }

        if (organization.disabled) {
            return Result.fail(UseCaseError.create('c', 'Organization is disabled'));
        }

        if (!client || client.disabled) {
            return Result.fail(UseCaseError.create('c', 'User is not a client'));
        }

        if (((userWallet.points + userWallet.bonusPoints + userWallet.cashbackPoints) < req.usedPoints) && req.usedPoints > 0) {
            return Result.fail(UseCaseError.create('t'));
        }

        let purchaseSum = purchase.sumInPoints;
        if (userWallet.currency != purchase.currency) {
            const exchangeMade = await this.currencyService.exchange(purchase.currency, userWallet.currency);
            if (exchangeMade.isFailure) {
                return Result.fail(UseCaseError.create('a', `Error in the process of exchange of ${purchase.currency} and ${userWallet.currency}`));
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
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        const paymentCreated = await this.createPaymentUseCase.execute({
            currency: userWallet.currency,
            ref: purchase._id.toString(),
            sum: purchaseSum,
            type: 'purchase',
            usedPoints: req.usedPoints,
            shopId: organization.paymentType == 'split' ? legal.paymentShopId || '' : '',
            safe: organizationUser.paymentCardId && organization.paymentType == 'safe' && legal.form == 'individual' ? true : false
        });

        if (paymentCreated.isFailure) {
            return Result.fail(paymentCreated.getError());
        }

        const { payment } = paymentCreated.getValue()!;
        purchase.processing = true;

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

    private async getKeyObjects(purchaseId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const purchaseFound = await this.purchaseRepo.findById(purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('u'));
        }

        const purchase = purchaseFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const organizationUserFound = await this.userRepo.findById(organization.user.toString());
        if (organizationUserFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization user'));
        }

        const organizationUser = organizationUserFound.getValue()!;

        const userFound = await this.userRepo.findById(purchase.user.toHexString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        let client: IClient | undefined;

        const clientFound = await this.clientRepo.findByOrganizationAndUser(organization._id.toString(), user._id.toString());
        if (clientFound.isSuccess) {
            client = clientFound.getValue()!;
        }

        const userWalletFound = await this.walletRepo.findById(user.wallet.toHexString());
        if (userWalletFound.isFailure) {
            return Result.fail(userWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding userWallet') : UseCaseError.create('r'));
        }

        const userWallet = userWalletFound.getValue()!;

        const legalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (legalFound.isFailure) {
            return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal') : UseCaseError.create('b4'));
        }

        const legal = legalFound.getValue()!;

        return Result.ok({
            global,
            organization,
            organizationUser,
            purchase,
            user,
            userWallet,
            client,
            legal
        });
    }
}
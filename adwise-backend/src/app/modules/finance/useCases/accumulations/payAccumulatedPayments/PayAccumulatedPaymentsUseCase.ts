import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { logger } from "../../../../../services/logger";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IAccumulation } from "../../../models/Accumulation";
import { IPayment } from "../../../models/Payment";
import { IAccumulationRepo } from "../../../repo/accumulations/IAccumulationRepo";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { ConfirmPaymentUseCase } from "../../payments/confirmPayment/ConfirmPaymentUseCase";
import { CalculatePurchaseMarketingUseCase } from "../../purchases/calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { PayAccumulatedPaymentsDTO } from "./PayAccumulatedPaymentsDTO";
import { payAccumulatedPaymentsErrors } from "./payAccumulatedPaymentsErrors";

interface IKeyObjects {
    global: IGlobal;
    accumulations: IAccumulation[];
};

export class PayAccumulatedPaymentsUseCase implements IUseCase<PayAccumulatedPaymentsDTO.Request, PayAccumulatedPaymentsDTO.Response> {
    private userRepo: IUserRepo;
    private globalRepo: IGlobalRepo;
    private walletRepo: IWalletRepo;
    private paymentRepo: IPaymentRepo;
    private purchaseRepo: IPurchaseRepo;
    private paymentService: IPaymentService;
    private accumulationRepo: IAccumulationRepo;
    private organizationRepo: IOrganizationRepo;
    private createTransactionUseCase: CreateTransactionUseCase;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;

    public errors = payAccumulatedPaymentsErrors;

    constructor(
        userRepo: IUserRepo, 
        globalRepo: IGlobalRepo, 
        walletRepo: IWalletRepo,
        paymentRepo: IPaymentRepo,
        purchaseRepo: IPurchaseRepo,
        paymentService: IPaymentService, 
        accumulationRepo: IAccumulationRepo, 
        organizationRepo: IOrganizationRepo,
        createTransactionUseCase: CreateTransactionUseCase,
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase
    ) {
        this.userRepo = userRepo;
        this.globalRepo = globalRepo;
        this.walletRepo = walletRepo;
        this.paymentRepo = paymentRepo;
        this.purchaseRepo = purchaseRepo;
        this.paymentService = paymentService;
        this.accumulationRepo = accumulationRepo;
        this.organizationRepo = organizationRepo;
        this.createTransactionUseCase = createTransactionUseCase;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;
    }

    public async execute(_: PayAccumulatedPaymentsDTO.Request): Promise<PayAccumulatedPaymentsDTO.Response> {
        const keyObjectsGotten = await this.getKeyObjects();
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            accumulations,
            global
        } = keyObjectsGotten.getValue()!;

        const accumulationIds: string[] = [];

        for (const accumulation of accumulations) {
            let suitedForPayment = true;

            if (accumulation.sum < global.minimalPayment) suitedForPayment = false;

            const date = new Date();
            if (accumulation.dueDate.getTime() - date.getTime() < 0 && !suitedForPayment) suitedForPayment = true;

            if (!suitedForPayment) continue;

            const accumulationPaid = await this.payAccumulation(accumulation, global);
            if (accumulationPaid.isFailure) {
                logger.error(`SYSTEM: Accumulation ${accumulation._id} could not be paid`);
                
                const error = accumulationPaid.getError()!;
                logger.error(error.stack!, error.message, error.details);
                continue;
            }

            logger.info(`SYSTEM: Accumulation ${accumulation._id} has been successfully paid`);
            
            accumulationIds.push(accumulation._id.toString());
        }

        return Result.ok({accumulationIds});
    }

    private async payAccumulation(accumulation: IAccumulation, global: IGlobal): Promise<Result<string | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(accumulation.user.toString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        if (!user.paymentCardId) {
            return Result.fail(UseCaseError.create('c', 'User has no payment card'));
        }

        const paymentIds = accumulation.payments.map(p => p.toString());

        const paymentsFound = await this.paymentRepo.findByIds(paymentIds);
        if (paymentsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding payment'));
        }

        const payments = paymentsFound.getValue()!;

        let accumulationPaid: Result<true | null, UseCaseError | null>;

        if (accumulation.type == 'purchase') {
            accumulationPaid = await this.payPurchaseAccumulation(accumulation, payments, user);
        } else {
            accumulationPaid = await this.payTipsAccumulation(accumulation, global, user);
        }

        if (accumulationPaid.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon paying accumulation'));
        }

        accumulation.closed = true;
        
        const accumulationSaved = await this.accumulationRepo.save(accumulation);
        if (accumulationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving accumulation'));
        }

        return Result.ok(accumulation._id.toString());
    }

    private async payPurchaseAccumulation(accumulation: IAccumulation, payments: IPayment[], user: IUser): Promise<Result<true | null, UseCaseError | null>> {
        const purchaseIds = payments.map(p => p.ref.toString());
        
        const purchasesFound = await this.purchaseRepo.findByIds(purchaseIds);
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const purchases = purchasesFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(purchases[0].organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization'));
        }

        const organization = organizationFound.getValue()!;

        const walletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding wallet'));
        }

        const wallet = walletFound.getValue()!;

        let realMoney = accumulation.sum; // 40
        let moneyToPay = 0; // 40

        const purchaseMoneyToPayMap: {
            [key: string]: number
        } = {};

        for (const purchase of purchases) {
            const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({purchase});
            if (purchaseMarketingCalculated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon calculating purchase marketing'));
            }

            const {
                totalSum
            } = purchaseMarketingCalculated.getValue()!;

            const purchaseMoneyToPay = (purchase.sumInPoints - totalSum);

            moneyToPay += purchaseMoneyToPay; // 845

            purchaseMoneyToPayMap[purchase._id.toString()] = purchaseMoneyToPay;
        }

        if (realMoney < moneyToPay) {
            moneyToPay = realMoney; // 583
        }

        moneyToPay = Number(moneyToPay.toFixed(2));
        
        const paymentInitiated = await this.paymentService.initPaymentSafe(moneyToPay, 'rub', accumulation._id, accumulation.accumulationId, user.paymentCardId);
        if (paymentInitiated.isFailure) {
            logger.error(paymentInitiated.getError()!.stack!, paymentInitiated.getError()!.message);
            return Result.fail(UseCaseError.create('a', 'Error upon initiating payment'));
        }

        const servicePayment = paymentInitiated.getValue()!;
        
        const paymentConfirmed = await this.paymentService.confirmPaymentSafe(servicePayment.id);
        if (paymentConfirmed.isFailure) {
            console.log(paymentConfirmed.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon confirming payment'));
        }

        await this.createTransactionUseCase.execute({
            currency: wallet.currency,
            from: wallet._id,
            to: undefined as any,
            type: 'correct',
            sum: moneyToPay,
            user: user,
            organization: organization,
            context: accumulation._id.toString(),
            origin: 'safe',
            frozen: false
        });

        return Result.ok(true);
    }

    private async payTipsAccumulation(accumulation: IAccumulation, global: IGlobal, user: IUser): Promise<Result<true | null, UseCaseError | null>> {
        const globalOrganizationFound = await this.organizationRepo.findById(global.organization.toString());
        if (globalOrganizationFound.isFailure) {
            return Result.fail(globalOrganizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding global organization') : UseCaseError.create('l'));
        }

        const globalOrganization = globalOrganizationFound.getValue()!;

        const walletFound = await this.walletRepo.findById(user.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding wallet'));
        }

        const wallet = walletFound.getValue()!;

        const adwiseSum = accumulation.sum * (global.purchasePercent / 100);

        await this.createTransactionUseCase.execute({
            currency: wallet.currency,
            from: undefined as any,
            to: globalOrganization.wallet.toString(),
            type: 'adwise',
            sum: adwiseSum,
            user: user,
            context: accumulation._id,
            origin: 'safe',
            frozen: false
        });

        const sum = accumulation.sum - adwiseSum;

        await this.createTransactionUseCase.execute({
            currency: wallet.currency,
            from: undefined as any,
            to: wallet._id,
            type: 'tips',
            sum: sum,
            user: user,
            context: accumulation._id,
            origin: 'safe',
            frozen: false
        });

        const paymentInitiated = await this.paymentService.initPaymentSafe(sum, 'rub', accumulation._id, accumulation.accumulationId, user.paymentCardId);
        if (paymentInitiated.isFailure) {
            console.log(paymentInitiated.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon initiating payment'));
        }

        const servicePayment = paymentInitiated.getValue()!;
        
        const paymentConfirmed = await this.paymentService.confirmPaymentSafe(servicePayment.id);
        if (paymentConfirmed.isFailure) {
            console.log(paymentConfirmed.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon confirming payment'));
        }

        return Result.ok(true);
    }

    private async getKeyObjects(): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;
        
        const accumulationsFound = await this.accumulationRepo.findManyByClosed(false);
        if (accumulationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding accumulations'));
        }

        const accumulations = accumulationsFound.getValue()!;

        return Result.ok({
            accumulations,
            global
        });
    }
}
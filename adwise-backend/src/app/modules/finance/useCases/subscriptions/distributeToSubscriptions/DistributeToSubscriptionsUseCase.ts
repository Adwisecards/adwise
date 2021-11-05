import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotificationService } from "../../../../../services/notificationService/INotificationService";
import { IEventListenerService } from "../../../../global/services/eventListenerService/IEventListenerService";
import { SendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification/SendNotificationUseCase";
import { IClient } from "../../../../organizations/models/Client";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IEmployee } from "../../../../organizations/models/Employee";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IClientRepo } from "../../../../organizations/repo/clients/IClientRepo";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IEmployeeRepo } from "../../../../organizations/repo/employees/IEmployeeRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IWallet } from "../../../models/Wallet";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { ISubscriptionValidationService } from "../../../services/subscriptions/subscriptionValidationService/ISubscriptionValidationService";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { DistributeToSubscriptionsDTO } from "./DistributeToSubscriptionsDTO";
import { distributeToSubscriptionsErrors } from "./distributeToSubscriptionsErrors";

interface IRefPaymentExtended extends DistributeToSubscriptionsDTO.IRefPayment {
    user: IUser;
    userWallet: IWallet;
    organization: IOrganization;
    organizationWallet: IWallet;
    coupon: ICoupon;
    employee?: IEmployee;
};

export class DistributeToSubscriptionsUseCase implements IUseCase<DistributeToSubscriptionsDTO.Request, DistributeToSubscriptionsDTO.Response> {
    private walletRepo: IWalletRepo;
    private organizationRepo: IOrganizationRepo;
    private couponRepo: ICouponRepo;
    private createTransactionUseCase: CreateTransactionUseCase;
    private employeeRepo: IEmployeeRepo;
    private clientRepo: IClientRepo;
    private userRepo: IUserRepo;
    private subscriptionValidationService: ISubscriptionValidationService;
    private eventListenerService: IEventListenerService;
    private sendNotificationUseCase: SendNotificationUseCase;
    
    public errors: UseCaseError[] = [
        ...distributeToSubscriptionsErrors
    ];

    constructor(
        walletRepo: IWalletRepo,
        organizationRepo: IOrganizationRepo,
        couponRepo: ICouponRepo,
        createTransactionUseCase: CreateTransactionUseCase,
        employeeRepo: IEmployeeRepo,
        clientRepo: IClientRepo,
        subscriptionValidationService: ISubscriptionValidationService,
        userRepo: IUserRepo,
        eventListenerService: IEventListenerService,
        sendNotificationUseCase: SendNotificationUseCase
    ) {
        this.walletRepo = walletRepo;
        this.organizationRepo = organizationRepo;
        this.couponRepo = couponRepo;
        this.createTransactionUseCase = createTransactionUseCase;
        this.employeeRepo = employeeRepo;
        this.clientRepo = clientRepo;
        this.subscriptionValidationService = subscriptionValidationService;
        this.userRepo = userRepo;
        this.eventListenerService = eventListenerService;
        this.sendNotificationUseCase = sendNotificationUseCase;
    }

    public async execute(req: DistributeToSubscriptionsDTO.Request): Promise<DistributeToSubscriptionsDTO.Response> {
        const valid = this.subscriptionValidationService.distributeToSubscriptionsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        // We need to extend ref payments gotten from calculateRefPayments method
        const extendedRefPaymentsGotten = await this.extendRefPayments(req.refPayments);
        if (extendedRefPaymentsGotten.isFailure) {
            return Result.fail(extendedRefPaymentsGotten.getError());
        }

        const extendedRefPayments = extendedRefPaymentsGotten.getValue()!;

        const origin = req.cash ? 'cash' : (req.safe ? 'safe' : (req.split ? 'split' : 'online'));

        const distributedToSubscriptions = await this.distributeToSubscriptions(extendedRefPayments, origin);  
        if (distributedToSubscriptions.isFailure) {
            return Result.fail(distributedToSubscriptions.getError());
        }

        const pointsDistributed = distributedToSubscriptions.getValue()!.pointsDistributed;

        return Result.ok({pointsDistributed});
    }

    private async distributeToSubscriptions(refPayments: IRefPaymentExtended[], origin: string): Promise<DistributeToSubscriptionsDTO.Response> {
        let pointsDistributed = 0;

        if (!refPayments.length) return Result.ok({pointsDistributed});

        for (const refPayment of refPayments) {
            console.log(pointsDistributed);
            pointsDistributed += refPayment.sum;

            if (refPayment.coupon.type != 'service') {
                refPayment.userWallet.frozenPoints.push({
                    type: 'bonus',
                    sum: refPayment.sum,
                    timestamp: new Date()
                });
            }

            const transactionCreated = await this.createTransactionUseCase.execute({
                currency: refPayment.userWallet.currency,
                from: origin == 'cash' ? refPayment.organizationWallet._id : undefined as any,
                to: refPayment.userWallet._id,
                type: 'ref',
                sum: refPayment.sum,
                coupon: refPayment.coupon,
                subscription: refPayment.subscription,
                context: refPayment.purchase._id.toString(),
                organization: refPayment.organization,
                user: refPayment.user,
                origin: origin,
                frozen: refPayment.coupon.type == 'product'
            });

            console.log(transactionCreated);

            if (transactionCreated.isFailure) {
                console.log(transactionCreated.getError());
            }

            const userWalletSaved = await this.walletRepo.save(refPayment.userWallet);
            if (userWalletSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user wallet'));
            }

            await this.sendNotificationUseCase.execute({
                type: 'refPurchase',
                receiverIds: [refPayment.user._id.toString()],
                values: {
                    points: refPayment.sum.toFixed(2)
                },
                data: {
                    
                }
            });

            this.eventListenerService.dispatchEvent({
                id: refPayment.user._id.toString(),
                subject: refPayment.purchase._id,
                type: 'refPurchase'
            });
        }

        const organizationWalletSaved = await this.walletRepo.save(refPayments[0].organizationWallet);
        if (organizationWalletSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization wallet'));
        }

        return Result.ok({pointsDistributed});
    }

    private async extendRefPayments(refPayments: DistributeToSubscriptionsDTO.IRefPayment[]): Promise<Result<IRefPaymentExtended[] | null, UseCaseError | null>> {
        const extendedRefPaymnets: IRefPaymentExtended[] = [];

        if (!refPayments.length) {
            return Result.ok([]);
        }

        const { purchase } = refPayments[0];

        for (const refPayment of refPayments) {


            const userFound = await this.userRepo.findById(refPayment.subscription.subscriber.toString());
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
            }

            const user = userFound.getValue()!;

            const userWalletFound = await this.walletRepo.findById(user.wallet.toString());
            if (userWalletFound.isFailure) {
                return Result.fail(userWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
            }

            const userWallet = userWalletFound.getValue()!;

            const organizationFound = await this.organizationRepo.findById(refPayment.purchase.organization.toString());
            if (organizationFound.isFailure) {
               return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }
            
            const organization = organizationFound.getValue()!;

            const organizationWalletFound = await this.walletRepo.findById(organization.wallet.toString());
            if (organizationWalletFound.isFailure) {
                return Result.fail(organizationWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization wallet') : UseCaseError.create('r', 'Organization wallet does not exist'));
            }

            const organizationWallet = organizationWalletFound.getValue()!;

            const coupon = refPayment.coupon;

            const employeeFound = await this.employeeRepo.findByOrganizationAndUser(organization._id, user._id);

            const employee = employeeFound.isSuccess ? employeeFound.getValue()! : undefined;
        
            extendedRefPaymnets.push({
                subscription: refPayment.subscription,
                sum: refPayment.sum,
                user: user,
                userWallet: userWallet,
                purchase: refPayment.purchase,
                coupon: coupon,
                organization: organization,
                organizationWallet: organizationWallet,
                employee
            });
        }

        return Result.ok(extendedRefPaymnets);
    }
}
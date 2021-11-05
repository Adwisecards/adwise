import { Result } from "../../app/core/models/Result";
import { UseCaseError } from "../../app/core/models/UseCaseError";
import { configProps } from "../../app/services/config";
import { IDatabase } from "../../app/services/database/IDatabase";
import { logger } from "../../app/services/logger";
import { CreateAddressTest } from "./tests/createAddressTest/CreateAddressTest";
import { CreateCategoryTest } from "./tests/createCategoryTest/CreateCategoryTest";
import { CreateCouponCategoryTest } from "./tests/createCouponCategoryTest/CreateCouponCategoryTest";
import { CreateCouponsTest } from "./tests/createCouponsTest/CreateCouponsTest";
import { CreateGlobalTest } from "./tests/createGlobalTest/CreateGlobalTest";
import { CreateOrganizationTest } from "./tests/createOrganizationTest/CreateOrganizationTest";
import { CreatePacketTest } from "./tests/createPacketTest/CreatePacketTest";
import { CreatePurchasesTest } from "./tests/createPurchasesTest/CreatePurchasesTest";
import { CreateUsersTest } from "./tests/createUsersTest/CreateUsersTest";
import { HandlePaymentStatusTest } from "./tests/handlePaymentStatusTest/HandlePaymentStatusTest";
import { PayPurchasesTest } from "./tests/payPurchasesTest/PayPurchasesTest";
import { SetOrganizationPacketTest } from "./tests/setOrganizationPacketTest/SetOrganizationPacketTest";
import { SetOrganizationTest } from "./tests/setOrganizationTest/SetOrganizationTest";
import { SubscribeToOrganizationTest } from "./tests/subscribeToOrganizationTest/SubscribeToOrganizationTest";

export class IntegrationTest {
    private database: IDatabase;
    private createGlobalTest: CreateGlobalTest;
    private createUsersTest: CreateUsersTest;
    private createCategoryTest: CreateCategoryTest;
    private createAddressTest: CreateAddressTest;
    private createPacketTest: CreatePacketTest;
    private createOrganizationTest: CreateOrganizationTest;
    private setOrganizationTest: SetOrganizationTest;
    private setOrganizationPacketTest: SetOrganizationPacketTest;
    private subscribeToOrganizationTest: SubscribeToOrganizationTest;
    private createCouponCategoryTest: CreateCouponCategoryTest;
    private createCouponsTest: CreateCouponsTest;
    private createPurchasesTest: CreatePurchasesTest;
    private payPurchasesTest: PayPurchasesTest;
    private handlePaymentStatusTest: HandlePaymentStatusTest;

    constructor(
        database: IDatabase,
        createGlobalTest: CreateGlobalTest,
        createUsersTest: CreateUsersTest,
        createCategoryTest: CreateCategoryTest,
        createAddressTest: CreateAddressTest,
        createPacketTest: CreatePacketTest,
        createOrganizationTest: CreateOrganizationTest,
        setOrganizationTest: SetOrganizationTest,
        setOrganizationPacketTest: SetOrganizationPacketTest,
        subscribeToOrganizationTest: SubscribeToOrganizationTest,
        createCouponCategoryTest: CreateCouponCategoryTest,
        createCouponsTest: CreateCouponsTest,
        createPurchasesTest: CreatePurchasesTest,
        payPurchasesTest: PayPurchasesTest,
        handlePaymentStatusTest: HandlePaymentStatusTest
    ) {
        this.database = database;
        this.createGlobalTest = createGlobalTest;
        this.createUsersTest = createUsersTest;
        this.createCategoryTest = createCategoryTest;
        this.createAddressTest = createAddressTest;
        this.createPacketTest = createPacketTest;
        this.createOrganizationTest = createOrganizationTest;
        this.setOrganizationTest = setOrganizationTest;
        this.setOrganizationPacketTest = setOrganizationPacketTest;
        this.subscribeToOrganizationTest = subscribeToOrganizationTest;
        this.createCouponCategoryTest = createCouponCategoryTest;
        this.createCouponsTest = createCouponsTest;
        this.createPurchasesTest = createPurchasesTest;
        this.payPurchasesTest = payPurchasesTest;
        this.handlePaymentStatusTest = handlePaymentStatusTest;
    }
    
    public async execute(): Promise<Result<boolean | null, UseCaseError | null>> {
        if (configProps.nodeEnv.toLowerCase() != 'test') {
            throw new Error('Environment is not testing');
        }

        logger.info('CreateGlobalTest being executed...');
        const createGlobalTested = await this.createGlobalTest.execute();
        if (createGlobalTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(createGlobalTested.getError());
        }

        let { global } = createGlobalTested.getValue()!;

        logger.info('CreateUsersTest being executed...');
        const createUsersTested = await this.createUsersTest.execute();
        if (createUsersTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(createUsersTested.getError());
        }

        let { clientUser, organizationUser, organizationUserWallet, clientUserWallet } = createUsersTested.getValue()!;

        logger.info('CreateCategoryTest being executed...');
        const createCategoryTested = await this.createCategoryTest.execute();
        if (createCategoryTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(createCategoryTested.getError());
        }

        const { category } = createCategoryTested.getValue()!;

        logger.info('CreateAddressTest being executed...');
        const createAddressTested = await this.createAddressTest.execute();
        if (createAddressTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(createAddressTested.getError());
        }

        const { address } = createAddressTested.getValue()!;

        logger.info('CreatePacketTest being executed...');
        const createPacketTested = await this.createPacketTest.execute();
        if (createPacketTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(createPacketTested.getError());
        }

        const { packet } = createPacketTested.getValue()!;

        logger.info('CreateOrganizationTest being executed...');
        const createOrganizationTested = await this.createOrganizationTest.execute(organizationUser, category, address, packet);
        if (createOrganizationTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(createOrganizationTested.getError());
        }

        let { defaultCashierContact, defaultCashierEmployee, organization, organizationUser: newOrganizationUser } = createOrganizationTested.getValue()!;
    
        organizationUser = newOrganizationUser;

        logger.info('SetOrganizationTest being executed...');
        const setOrganizationTested = await this.setOrganizationTest.execute(organization);
        if (setOrganizationTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(setOrganizationTested.getError());
        }

        let { global: newGlobal, legal, organization: newOrganization } = setOrganizationTested.getValue()!;

        global = newGlobal;
        organization = newOrganization;

        logger.info('SetOrganizationPacketTest being executed...');
        const setOrganizationPacketTested = await this.setOrganizationPacketTest.setOrganizationPacketTest(organization, packet);
        if (setOrganizationPacketTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(setOrganizationTested.getError());
        }

        const { organization: organizationWithPacket } = setOrganizationPacketTested.getValue()!;

        organization = organizationWithPacket;

        logger.info('SubscribeToOrganizationTest being executed...');
        const subscribeToOrganizationTested = await this.subscribeToOrganizationTest.execute(organization, clientUser);
        if (subscribeToOrganizationTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(subscribeToOrganizationTested.getError());
        }

        let { clientUserClient, clientUserContact, clientUserSubscription, organization: organizationWithSubscription } = subscribeToOrganizationTested.getValue()!;
        
        organization = organizationWithSubscription;

        logger.info('CreateCouponCategoryTest being executed...');
        const createCouponCategoryTested = await this.createCouponCategoryTest.execute(organization);
        if (createCouponCategoryTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(createCouponCategoryTested.getError()!);
        }

        const { couponCategory } = createCouponCategoryTested.getValue()!;

        logger.info('CreateCouponsTest being executed...');
        const createCouponsTested = await this.createCouponsTest.execute(organization, couponCategory);
        if (createCouponsTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(createCouponsTested.getError());
        }

        let { coupons, organization: organizationWithCoupons } = createCouponsTested.getValue()!;

        organization = organizationWithCoupons;

        logger.info('CreatePurchasesTest being executed...');
        const createPurchasesTested = await this.createPurchasesTest.execute(organization, coupons, defaultCashierContact, clientUser, clientUserContact);
        if (createPurchasesTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(createPurchasesTested.getError());
        }

        let { purchases } = createPurchasesTested.getValue()!;

        logger.info('PayPurchasesTest being executed...');
        const payPurchasesTested = await this.payPurchasesTest.execute(purchases);
        if (payPurchasesTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(payPurchasesTested.getError());
        }

        let { payments, purchases: paidPurchases } = payPurchasesTested.getValue()!;

        purchases = paidPurchases;

        logger.info('HandlePaymentStatusTest being executed...');
        const handlePaymentStatusTested = await this.handlePaymentStatusTest.execute(purchases, payments, global);
        if (handlePaymentStatusTested.isFailure) {
            await this.database.dropDatabase();
            return Result.fail(handlePaymentStatusTested.getError());
        }

        let { payments: paidPayments, purchases: confirmedPurchases } = handlePaymentStatusTested.getValue()!;

        purchases = confirmedPurchases;
        payments = paidPayments;

        logger.info('System has been tested');

        await this.database.dropDatabase();

        return Result.ok(true);
    }

    

    // private async setOrganizationPacketTest(organization: IOrganization, packet: IPacket): Promise<Result<ISetOrganizationPacketObjects | null, UseCaseError | null>> {
    //     const organizationPacketSet = await this.setOrganizationPacketUseCase.execute({
    //         date: new Date().toISOString(),
    //         noRecord: false,
    //         organizationId: organization._id.toString(),
    //         packetId: packet._id.toString(),
    //         asWisewinOption: false,
    //         reason: 'FO DA TEST'
    //     });

    //     if (organizationPacketSet.isFailure) {
    //         return Result.fail(organizationPacketSet.getError());
    //     }

    //     const organizationFound = await this.organizationRepo.findById(organization._id.toString());
    //     if (organizationFound.isFailure) {
    //         return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
    //     }

    //     organization = organizationFound.getValue()!;

    //     if (!organization.packet) {
    //         return Result.fail(UseCaseError.create('c', 'Organization has no packet'));
    //     }

    //     return Result.ok({organization});
    // }

    // // private async checkPacketTransactions(packet: IPacket, organization: IOrganization): Promise<Result<ICheckPacketTransactionsObjects | null, UseCaseError | null>> {
    // //     const packetSoldRecordFound = await this.packetSoldRecordRepo.findByPacketIdAndOrganization(packet._id.toString(), organization._id.toString());
    // //     if (packetSoldRecordFound.isFailure) {
    // //         return Result.fail(packetSoldRecordFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet sold record') : UseCaseError.create('b', 'Packet sold record does not exist'));
    // //     }

    // //     const packetSoldRecord = packetSoldRecordFound.getValue()!;

    // //     const transactionFound = await this.transactionRepo.
    // // }

    // private async checkPurchaseTransactions(purchase: IPurchase, payment: IPayment, global: IGlobal): Promise<Result<ICheckPurchaseTransactionsObjects | null, UseCaseError | null>> {
    //     const { coupons, offers } = purchase;
        
    //     const transactionsFound = await this.transactionRepo.findByContexts([purchase._id.toString()]);
    //     if (transactionsFound.isFailure) {
    //         return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
    //     }

    //     const transactions = transactionsFound.getValue()!.filter(t => !t.disabled);

    //     if (!transactions.length) {
    //         return Result.fail(UseCaseError.create('c', 'No transactions in purchase context'));
    //     }
        
    //     const couponSum = coupons.reduce((sum, cur) => sum += cur.price, 0);
        
    //     let couponOfferSum = 0;
    //     let couponMaximumRefSum = 0;
    //     let couponTotalAdwiseSum = couponSum * (global.purchasePercent / 100);

    //     for (const index in coupons) {
    //         const coupon = coupons[index];
    //         const offer = offers[index];

    //         couponOfferSum += coupon.price * (offer.percent / 100);
    //         couponMaximumRefSum += coupon.price * (coupon.distributionSchema.first / 100);
    //         couponMaximumRefSum += coupon.price * ((coupon.distributionSchema.other * 20) / 100);
    //     }

    //     const usedPointsTransactionSum = transactions.filter(t => t.type == 'usedPoints').reduce((sum, cur) => sum += cur.sum, 0);
    //     const paymentTransactionSum = transactions.filter(t => t.type == 'payment').reduce((sum, cur) => sum += cur.sum, 0);
    //     const managerPercentTransactionSum = transactions.filter(t => t.type == 'managerPercent').reduce((sum, cur) => sum += cur.sum, 0);
    //     const adwiseTransactionSum = transactions.filter(t => t.type == 'adwise').reduce((sum, cur) => sum += cur.sum, 0);
    //     const paymentGatewayTransactionSum = transactions.filter(t => t.type == 'paymentGateway').reduce((sum, cur) => sum += cur.sum, 0);
    //     const offerTransactionSum = transactions.filter(t => t.type == 'offer').reduce((sum, cur) => sum += cur.sum, 0);
    //     const purchaseTransactionSum = transactions.filter(t => t.type == 'purchase').reduce((sum, cur) => sum += cur.sum, 0);
    //     const refTransactionSum = transactions.filter(t => t.type == 'ref').reduce((sum, cur) => sum += cur.sum, 0);

    //     const totalPaymentSum = usedPointsTransactionSum + paymentTransactionSum;
    //     const totalAdwiseSum = adwiseTransactionSum + managerPercentTransactionSum + paymentGatewayTransactionSum;

    //     // CHECKS

    //     if (couponSum != purchase.sumInPoints) {
    //         return Result.fail(UseCaseError.create('c', 'Purchase sum is not correct'));
    //     }

    //     if (totalPaymentSum != purchase.sumInPoints) {
    //         return Result.fail(UseCaseError.create('c', 'Total payment transaction sum is not correct'));
    //     }

    //     if (offerTransactionSum != couponOfferSum) {
    //         return Result.fail(UseCaseError.create('c', 'Offer transaction sum is not correct'));
    //     }

    //     if (refTransactionSum > couponMaximumRefSum) {
    //         return Result.fail(UseCaseError.create('c', 'Ref transaction sum is not correct'));
    //     }

    //     if (totalAdwiseSum != couponTotalAdwiseSum) {
    //         return Result.fail(UseCaseError.create('c', 'Total adwise transaction sum is not correct'));
    //     }

    //     if ((payment.cash && paymentGatewayTransactionSum > 0) || (!payment.cash && paymentGatewayTransactionSum == 0)) {
    //         return Result.fail(UseCaseError.create('c', 'Payment gateway transaction sum is not correct'));
    //     }

    //     const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({purchase});
    //     if (purchaseMarketingCalculated.isFailure) {
    //         return Result.fail(purchaseMarketingCalculated.getError());
    //     }

    //     const {
    //         adwiseSum,
    //         adwiseSumForCash,
    //         couponsWithMarketing,
    //         couponsWithOfferSum,
    //         managerSum,
    //         offerPayments,
    //         offerTotalSum,
    //         paymentGatewaySum,
    //         refPayments,
    //         refSum,
    //         totalSum,
    //         totalSumForCash
    //     } = purchaseMarketingCalculated.getValue()!;

    //     const organizationPoints = purchase.sumInPoints - totalSum;
    //     const organizationPointsForCash = purchase.sumInPoints - totalSumForCash;

    //     if ((payment.cash && purchaseTransactionSum != organizationPointsForCash) || (!payment.cash && purchaseTransactionSum != organizationPoints)) {
    //         return Result.fail(UseCaseError.create('c', 'Purchase points not correct'));
    //     }

    //     if (refSum != refTransactionSum) {
    //         return Result.fail(UseCaseError.create('c', 'Ref points not correct'));
    //     }

    //     if (offerTotalSum != offerTransactionSum) {
    //         return Result.fail(UseCaseError.create('c', 'Offer points not correct'));
    //     }

    //     if (managerSum != managerPercentTransactionSum) {
    //         return Result.fail(UseCaseError.create('c', 'Manager points not correct'));
    //     }

    //     if ((payment.cash && adwiseSumForCash != adwiseTransactionSum) || (!payment.cash && adwiseSum != adwiseTransactionSum)) {
    //         return Result.fail(UseCaseError.create('c', 'Adwise points not correct'));
    //     }

    //     const factualPurchaseTransactionSum = totalAdwiseSum + refTransactionSum + purchaseTransactionSum + offerTransactionSum;
    //     if (factualPurchaseTransactionSum != totalPaymentSum) {
    //         return Result.fail(UseCaseError.create('c', 'Transaction sum is not correct'));
    //     }

    //     return Result.ok({purchase});
    // }
    
    // private async handlePaymentStatusTest(purchases: IPurchase[], payments: IPayment[], global: IGlobal): Promise<Result<IHandlePaymentStatusObjects | null, UseCaseError | null>> {
    //     const updatedPayments: IPayment[] = [];
    //     const updatedPurchases: IPurchase[] = [];
        
    //     for (const payment of payments) {
    //         const handlePaymentData: HandlePaymentStatusDTO.Request = {
    //             SpAccumulationId: undefined as any,
    //             amount: {
    //                 value: payment.sum,
    //                 currency: 'rub'
    //             },
    //             event: this.paymentService.successfulStatus,
    //             ip: '0.0.0.0',
    //             metadata: {
    //                 id: payment._id.toString()
    //             },
    //             paid: true
    //         };

    //         const paymentStatusHandled = await this.handlePaymentStatusUseCase.execute(handlePaymentData);
    //         if (paymentStatusHandled.isFailure) {
    //             return Result.fail(paymentStatusHandled.getError());
    //         }

    //         const { success } = paymentStatusHandled.getValue()!;

    //         if (!success) {
    //             return Result.fail(UseCaseError.create('c', 'Payment hadnling is not successful'));
    //         }

    //         const updatedPaymentFound = await this.paymentRepo.findById(payment._id.toString());
    //         if (updatedPaymentFound.isFailure) {
    //             return Result.fail(updatedPaymentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('4'));
    //         }

    //         const updatedPayment = updatedPaymentFound.getValue()!;

    //         const updatedPurchaseFound = await this.purchaseRepo.findById(updatedPayment.ref.toString());
    //         if (updatedPurchaseFound.isFailure) {
    //             return Result.fail(updatedPurchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
    //         }

    //         const updatedPurchase = updatedPurchaseFound.getValue()!;

    //         updatedPurchases.push(updatedPurchase);
    //         updatedPayments.push(updatedPayment);
    //     }

    //     purchases = updatedPurchases;
    //     payments = updatedPayments;

    //     for (const index in payments) {
    //         const payment = payments[index];
    //         const purchase = purchases[index];

    //         if (!payment.paid) {
    //             return Result.fail(UseCaseError.create('c', 'Payment is not paid'));
    //         }

    //         if (purchase.processing) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase is still in process'));
    //         }

    //         if (!purchase.confirmed) {
    //             return Result.fail(UseCaseError.create('c', 'purchase is not confirmed'));
    //         }

    //         if (purchase.complete) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase is complete'));
    //         }

    //         if (!purchase.paidAt) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase has no paidAt timestamp'));
    //         }

    //         const purchaseTransactionsChecked = await this.checkPurchaseTransactions(purchase, payment, global);
    //         if (purchaseTransactionsChecked.isFailure) {
    //             return Result.fail(purchaseTransactionsChecked.getError());
    //         }
    //     }

    //     return Result.ok({payments, purchases});
    // }

    // private async payPurchasesTest(purchases: IPurchase[]): Promise<Result<IPayPurchasesObjects | null, UseCaseError | null>> {
    //     const payments: IPayment[] = [];
    //     const updatedPurchases: IPurchase[] = [];
        
    //     for (const purchase of purchases) {
    //         const purchasePaid = await this.payPurchaseUseCase.execute({
    //             purchaseId: purchase._id.toString(),
    //             usedPoints: 0,
    //             comment: 'comment'
    //         });

    //         if (purchasePaid.isFailure) {
    //             return Result.fail(purchasePaid.getError()!);
    //         }

    //         const { payment } = purchasePaid.getValue()!;

    //         const updatedPurchaseFound = await this.purchaseRepo.findById(purchase._id.toString());
    //         if (updatedPurchaseFound.isFailure) {
    //             return Result.fail(updatedPurchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
    //         }

    //         const updatedPurchase = updatedPurchaseFound.getValue()!;

    //         payments.push(payment);
    //         updatedPurchases.push(updatedPurchase);
    //     }

    //     purchases = updatedPurchases;

    //     for (const index in payments) {
    //         const payment = payments[index];
    //         const purchase = purchases[index];
        
    //         if (!payment.ref) {
    //             return Result.fail(UseCaseError.create('c', 'Payment does not point to no purchase'));
    //         }

    //         if (payment.ref.toString() != purchase._id.toString()) {
    //             return Result.fail(UseCaseError.create('c', 'Payment pointing to incorrect purchase'));
    //         }

    //         if (payment.cash) {
    //             return Result.fail(UseCaseError.create('c', 'Payment type is cash'));
    //         }

    //         if (payment.split) {
    //             return Result.fail(UseCaseError.create('c', 'Payment type is split'));
    //         }

    //         if (payment.safe) {
    //             return Result.fail(UseCaseError.create('c', 'Payment type is safe'));
    //         }

    //         if (payment.paid) {
    //             return Result.fail(UseCaseError.create('c', 'Payment is paid'));
    //         }

    //         if (!purchase.payment) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase does not point to no payment'));
    //         }

    //         if (purchase.payment.toString() != payment._id.toString()) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase pointing to incorrect payment'));
    //         }

    //         if (Number(payment.sum) != Number(purchase.sumInPoints)) {
    //             return Result.fail(UseCaseError.create('c', 'Payment sum is not equal to purchase sum'));
    //         }

    //         if (!purchase.processing) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase is not in process'));
    //         }
    //     }

    //     return Result.ok({payments, purchases});
    // }

    // private async createPurchasesTest(organization: IOrganization, coupons: ICoupon[], defaultCashierContact: IContact, clientUser: IUser, clientUserContact: IContact): Promise<Result<ICreatePurchasesObjects | null, UseCaseError | null>> {
    //     const purchases: IPurchase[] = [];
        
    //     for (const coupon of coupons) {
    //         const purchaseCreated = await this.createPurchaseUseCase.execute({
    //             cashierContactId: defaultCashierContact._id.toString(),
    //             coupons: [{
    //                 count: 1,
    //                 couponId: coupon._id.toString()
    //             }],
    //             description: 'description',
    //             purchaserContactId: clientUserContact._id.toString(),
    //             userId: clientUser._id.toString()
    //         });

    //         if (purchaseCreated.isFailure) {
    //             return Result.fail(purchaseCreated.getError());
    //         }

    //         const { purchaseId } = purchaseCreated.getValue()!;

    //         const purchaseFound = await this.purchaseRepo.findById(purchaseId);
    //         if (purchaseFound.isFailure) {
    //             return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s', 'Purchase does not exist'));
    //         }

    //         const purchase = purchaseFound.getValue()!;

    //         purchases.push(purchase);
    //     }

    //     for (const index in purchases) {
    //         const purchase = purchases[index];
    //         const coupon = coupons[index];

    //         if (!purchase.organization) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase does not point to no organization'));
    //         }

    //         if (purchase.organization.toString() != organization._id.toString()) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase pointing to incorrect organization'));
    //         }

    //         if (!purchase.user) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase does not point to no user'));
    //         }

    //         if (purchase.user.toString() != clientUser._id.toString()) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase pointing to incorrect user'));
    //         }

    //         if (!purchase.purchaser) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase does not point to no purchaser'));
    //         }

    //         if (purchase.purchaser.toString() != clientUserContact._id.toString()) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase pointing to incorrect contact'));
    //         }

    //         const couponExists = !!purchase.coupons.find(c => c._id.toString() == coupon._id.toString());

    //         if (!couponExists) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase does not contain coupon'));
    //         }

    //         const offerExists = !!purchase.offers.find(o => o._id.toString() == coupon.offer.toString());

    //         if (!offerExists) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase does not contain offer'));
    //         }

    //         if (purchase.sumInPoints != coupon.price) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase sum is not correct'));
    //         }

    //         if (!purchase.cashier) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase does not point to no cashier'));
    //         }

    //         if (purchase.cashier.toString() != defaultCashierContact._id.toString()) {
    //             return Result.fail(UseCaseError.create('c', 'Purchase pointing to incorrect cashier'));
    //         }
    //     }

    //     return Result.ok({coupons, purchases});
    // }
}
import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { IZipService, IZipServiceFile } from "../../../../../services/zipService/IZipService";
import { ITransaction } from "../../../../finance/models/Transaction";
import { IWallet } from "../../../../finance/models/Wallet";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { GetOrganizationReportDTO } from "./GetOrganizationReportDTO";
import { getOrganizationReportErrors } from "./getOrganizationReportErrors";
import moment from 'moment';
import TransactionType from "../../../../../core/static/TransactionType";
import { IPaymentRepo } from "../../../../finance/repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { IPayment } from "../../../../finance/models/Payment";
import { IAccumulationRepo } from "../../../../finance/repo/accumulations/IAccumulationRepo";
import { IAccumulation } from "../../../../finance/models/Accumulation";
import { defaultAxiosInstance } from "@googlemaps/google-maps-services-js";

interface IKeyObjects {
    organization: IOrganization;
    wallet: IWallet;
    cashPurchaseTransactionsToOrganization: ITransaction[];
    cashTransactionsFromOrganization: ITransaction[];
    splitPurchaseTransactionsToOrganization: ITransaction[];
    splitCorrectTransactionsFromOrganization: ITransaction[];
    defaultPurchaseTransactionsToOrganization: ITransaction[];
    withdrawalTransactionsFromOrganization: ITransaction[];
    refBackToOrganizationTransactionsToOrganization: ITransaction[];
    safePurchaseTransactionsToOrganization: ITransaction[];
    safeCorrectTransactionsFromOrganization: ITransaction[];
    correctTransactionsToOrganization: ITransaction[];
    //payments: IPayment[];
    accumulations: IAccumulation[];
}

export class GetOrganizationReportUseCase implements IUseCase<GetOrganizationReportDTO.Request, GetOrganizationReportDTO.Response> {
    private zipService: IZipService;
    private walletRepo: IWalletRepo;
    private xlsxService: IXlsxService;
    private paymentRepo: IPaymentRepo;
    private purchaseRepo: IPurchaseRepo;
    private transactionRepo: ITransactionRepo;
    private accumulationRepo: IAccumulationRepo;
    private organizationRepo: IOrganizationRepo;
    
    public errors = getOrganizationReportErrors;

    constructor(
        zipService: IZipService,
        walletRepo: IWalletRepo,
        xlsxService: IXlsxService,
        paymentRepo: IPaymentRepo,
        purchaseRepo: IPurchaseRepo,
        transactionRepo: ITransactionRepo,
        accumulationRepo: IAccumulationRepo,
        organizationRepo: IOrganizationRepo
    ) {
        this.zipService = zipService;
        this.walletRepo = walletRepo;
        this.xlsxService = xlsxService;
        this.paymentRepo = paymentRepo;
        this.purchaseRepo = purchaseRepo;
        this.transactionRepo = transactionRepo;
        this.accumulationRepo = accumulationRepo;
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: GetOrganizationReportDTO.Request): Promise<GetOrganizationReportDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.organizationId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            cashPurchaseTransactionsToOrganization,
            cashTransactionsFromOrganization,
            defaultPurchaseTransactionsToOrganization,
            organization,
            splitCorrectTransactionsFromOrganization,
            splitPurchaseTransactionsToOrganization,
            wallet,
            withdrawalTransactionsFromOrganization,
            refBackToOrganizationTransactionsToOrganization,
            safePurchaseTransactionsToOrganization,
            safeCorrectTransactionsFromOrganization,
            correctTransactionsToOrganization,
            //payments,
            accumulations
        } = keyObjectsGotten.getValue()!;

        const cashPurchaseTransactionSum = cashPurchaseTransactionsToOrganization.reduce((sum, cur) => sum += cur.sum, 0);

        const cashTransactionsFromOrganizationSum = cashTransactionsFromOrganization.reduce((sum, cur) => sum += cur.sum, 0);

        const splitPurchaseTransactionSum = splitPurchaseTransactionsToOrganization.reduce((sum, cur) => sum += cur.sum, 0);

        const splitCorrectTransactionSum = splitCorrectTransactionsFromOrganization.reduce((sum, cur) => sum += cur.sum, 0);

        const defaultPurchaseTransactionSum = defaultPurchaseTransactionsToOrganization.reduce((sum, cur) => sum += cur.sum, 0);

        const withdrawalTransactionSum = withdrawalTransactionsFromOrganization.reduce((sum, cur) => sum += cur.sum, 0);

        const refBackToOrganizationTransactionSum = refBackToOrganizationTransactionsToOrganization.reduce((sum, cur) => sum += cur.sum, 0);

        const safePurchaseTransactionSum = safePurchaseTransactionsToOrganization.reduce((sum, cur) => sum += cur.sum, 0);

        const safeCorrectTransactionSum = safePurchaseTransactionsToOrganization.reduce((sum, cur) => sum += cur.sum, 0);

        const correctTransactionSum = correctTransactionsToOrganization.reduce((sum, cur) => sum += cur.sum, 0);

        //const paymentSum = payments.reduce((sum, cur) => sum += cur.sum, 0);

        const totalPurchaseSum = cashPurchaseTransactionSum + splitPurchaseTransactionSum + defaultPurchaseTransactionSum + safePurchaseTransactionSum + refBackToOrganizationTransactionSum;
        
        const totalCorrectSum = splitCorrectTransactionSum + safeCorrectTransactionSum;

        const points = wallet.points;

        const valueList: {[key: string]: number} = {
            'Базовый доход (наличные)': cashPurchaseTransactionSum,
            'Маркетинговые выплаты (наличные)': cashTransactionsFromOrganizationSum,
            'Базовый доход (сплит)': splitPurchaseTransactionSum,
            'Выплачено (сплит)': splitCorrectTransactionSum,
            'Базовый доход (стандартный терминал)': defaultPurchaseTransactionSum,
            'Базовый доход (безопасная сделка)': safePurchaseTransactionSum,
            'Выплачено (безопасная сделка)': safeCorrectTransactionSum,
            'Нереализованные баллы': refBackToOrganizationTransactionSum,
            'Всего получено': totalPurchaseSum,
            'Всего отправлено (бс и сплит)': totalCorrectSum,
            'Корректировки': correctTransactionSum,
            //'Сумма платежей': paymentSum,
            'Выплаты': withdrawalTransactionSum,
            'Баланс': Number(points.toFixed(2))
        };

        const transactionLists: {[key: string]: ITransaction[]} = {
            'bazoviy dohod (nalichnie)': cashPurchaseTransactionsToOrganization,
            'marketingovie viplati (nalichnie)': cashTransactionsFromOrganization,
            'bazoviy dohod (standartniy terminal)': defaultPurchaseTransactionsToOrganization,
            'viplacheno (split)': splitCorrectTransactionsFromOrganization,
            'bazoviy dohod (split)': splitPurchaseTransactionsToOrganization,
            'bazoviy dohod (safe)': safePurchaseTransactionsToOrganization,
            'viplacheno (safe)': safeCorrectTransactionsFromOrganization,
            'nerealizovannie balli': refBackToOrganizationTransactionsToOrganization,
            'viplati': withdrawalTransactionsFromOrganization
        };

        const files: IZipServiceFile[] = [];

        for (const key in transactionLists) {
            const transactionList = transactionLists[key];
            if (!transactionList?.length) {
                continue;
            }
            const xlsxGenerated = this.xlsxService.convert(transactionList.filter(t => !!t).map(t => {
                const transaction = t.toObject() as ITransaction;
                const date = moment(transaction.timestamp).format("DD.MM.YYYY / HH:mm");

                return {
                    'Дата / время': date,
                    'ID транзакции': transaction._id.toString(),
                    'Тип транзакции': TransactionType.translate(transaction.type, 'ru'),
                    'Сумма': transaction.sum.toFixed(2) + ' ₽',
                    'От кого (кошелек)': transaction.from ? (<any>transaction.from)._id.toString() : 'SYSTEM',
                    'Кому (кошелек)': transaction.to ? (<any>transaction.to)._id.toString() : 'SYSTEM',
                    'Организация': transaction.organization ? transaction.organization.name : '-',
                    'Купон': transaction.coupon ? transaction.coupon.name : '-',
                    'Статус': transaction.complete ? 'Завершено' : 'Не завершено',
                    'Источник': transaction.context || '-'
                };
            }));

            if (xlsxGenerated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
            }

            const xlsx = xlsxGenerated.getValue()!;

            files.push({
                data: xlsx,
                filename: key+'.xlsx'
            });
        }

        const xlsxGenerated = this.xlsxService.convert([valueList]);

        if (xlsxGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
        }

        const xlsx = xlsxGenerated.getValue()!;

        files.push({
            data: xlsx,
            filename: 'pokazateli.xlsx'
        });

        const zipCreated = this.zipService.createZip(files);
        if (zipCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon archiving files'));
        }

        const zip = zipCreated.getValue()!;



        return Result.ok({
            filename: 'report.zip',
            data: zip
        });
    }

    private async getKeyObjects(organizationId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const walletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        let keys = ['to', 'type', 'origin', 'disabled'];
        let values = [wallet._id.toString(), 'purchase', 'cash', 'false'];

        const cashPurchaseTransactionsToOrganizationFound = await this.transactionRepo.search(keys, values, 'timestamp', -1, 9000, 1);
        if (cashPurchaseTransactionsToOrganizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding cash purchase transactions'));
        }

        const cashPurchaseTransactionsToOrganization = cashPurchaseTransactionsToOrganizationFound.getValue()!;

        keys = ['from', 'origin', 'disabled'];
        values = [wallet._id.toString(), 'cash', 'false'];

        const cashTransactionsFromOrganizationsFound = await this.transactionRepo.search(keys, values, 'timestamp', -1, 9000, 1);
        if (cashTransactionsFromOrganizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding cash transactions'));
        }

        const cashTransactionsFromOrganization = cashTransactionsFromOrganizationsFound.getValue()!;

        keys = ['to', 'type', 'origin', 'disabled'];
        values = [wallet._id.toString(), 'purchase', 'split', 'false'];

        const splitPurchaseTransactionsToOrganizationFound = await this.transactionRepo.search(keys, values, 'timestamp', -1, 9000, 1);
        if (splitPurchaseTransactionsToOrganizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding split purchase transactions'));
        }

        const splitPurchaseTransactionsToOrganization = splitPurchaseTransactionsToOrganizationFound.getValue()!;
        
        keys = ['from', 'type', 'origin', 'disabled'];
        values = [wallet._id.toString(), 'correct', 'split', 'false'];

        const splitCorrectTransactionsFromOrganizationFound = await this.transactionRepo.search(keys, values, 'timestamp', -1, 9000, 1);
        if (splitCorrectTransactionsFromOrganizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding split correct transactions'));
        }

        const splitCorrectTransactionsFromOrganization = splitCorrectTransactionsFromOrganizationFound.getValue()!;

        keys = ['to', 'type', 'origin', 'disabled'];
        values = [wallet._id.toString(), 'purchase', 'online', 'false'];

        const defaultPurchaseTransactionsToOrganizationFound = await this.transactionRepo.search(keys, values, 'timestamp', -1, 9000, 1);
        if (defaultPurchaseTransactionsToOrganizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding default purchase transactions'));
        }

        const defaultPurchaseTransactionsToOrganization = defaultPurchaseTransactionsToOrganizationFound.getValue()!;

        keys = ['from', 'type', 'disabled'];
        values = [wallet._id.toString(), 'withdrawal', 'false'];

        const withdrawalTransactionsFromOrganizationFound = await this.transactionRepo.search(keys, values, 'timestamp', -1, 9000, 1);
        if (withdrawalTransactionsFromOrganizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding withdrawal transactions'));
        }

        const withdrawalTransactionsFromOrganization = withdrawalTransactionsFromOrganizationFound.getValue()!;

        keys = ['to', 'type', 'disabled'];
        values = [wallet._id.toString(), 'refBackToOrganization', 'false'];

        const refBackToOrganizationTransactionsToOrganizationFound = await this.transactionRepo.search(keys, values, 'timestamp', -1, 9000, 1);
        if (refBackToOrganizationTransactionsToOrganizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding refBackToOrganization transactions'));
        }

        const refBackToOrganizationTransactionsToOrganization = refBackToOrganizationTransactionsToOrganizationFound.getValue()!;

        keys = ['to', 'type', 'origin', 'disabled'];
        values = [wallet._id.toString(), 'purchase', 'safe', 'false'];

        const safePurchaseTransactionsToOrganizationFound = await this.transactionRepo.search(keys, values, 'timestamp', -1, 9000, 1);
        if (safePurchaseTransactionsToOrganizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding safe purchase transactions'));
        }

        const safePurchaseTransactionsToOrganization = safePurchaseTransactionsToOrganizationFound.getValue()!;
        
        const accumulationsFound = await this.accumulationRepo.findManyByUserAndClosed(organization.user.toString(), true);
        if (accumulationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding accumulations'));
        }

        const accumulations = accumulationsFound.getValue()!;

        const accumulationIds = accumulations.map(a => a._id);

        const safeCorrectTransactionsFromOrganizationFound = await this.transactionRepo.findByContexts(accumulationIds);

        if (safeCorrectTransactionsFromOrganizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const safeCorrectTransactionsFromOrganization = safeCorrectTransactionsFromOrganizationFound.getValue()!;

        keys = ['to', 'type', 'disabled'];
        values = [wallet._id.toString(), 'correct', 'false'];

        const correctTransactionsToOrganizationFound = await this.transactionRepo.search(keys, values, 'timestamp', -1, 9000, 1);
        if (correctTransactionsToOrganizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const correctTransactionsToOrganization = correctTransactionsToOrganizationFound.getValue()!;
        
        const purchasesFound = await this.purchaseRepo.findByOrganizationAndConfirmed(organization._id.toString(), 9000, 1);
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const purchases = purchasesFound.getValue()!.filter(p => !p.canceled);

        const purchaseIds = purchases.map(p => p._id.toString());

        return Result.ok({
            organization: organization,
            wallet: wallet,
            cashPurchaseTransactionsToOrganization,
            cashTransactionsFromOrganization,
            defaultPurchaseTransactionsToOrganization,
            splitCorrectTransactionsFromOrganization,
            splitPurchaseTransactionsToOrganization,
            withdrawalTransactionsFromOrganization,
            refBackToOrganizationTransactionsToOrganization,
            safePurchaseTransactionsToOrganization,
            safeCorrectTransactionsFromOrganization,
            correctTransactionsToOrganization,
            accumulations
        });
    }
}
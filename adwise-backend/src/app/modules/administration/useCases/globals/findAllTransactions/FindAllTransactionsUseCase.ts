import moment from "moment";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import TransactionType from "../../../../../core/static/TransactionType";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { ITransaction } from "../../../../finance/models/Transaction";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllTransactionsDTO } from "./FindAllTransactionsDTO";
import { findAllTransactionsErrors } from "./findAllTransactionsErrors";

export class FindAllTransactionsUseCase implements IUseCase<FindAllTransactionsDTO.Request, FindAllTransactionsDTO.Response> {
    private transactionRepo: ITransactionRepo;
    private administrationValidationService: IAdministrationValidationService;
    private xlsxService: IXlsxService;
    public errors = [
        ...findAllTransactionsErrors
    ];

    constructor(transactionRepo: ITransactionRepo, administrationValidationService: IAdministrationValidationService, xlsxService: IXlsxService) {
        this.transactionRepo = transactionRepo;
        this.administrationValidationService = administrationValidationService;
        this.xlsxService = xlsxService;
    }

    public async execute(req: FindAllTransactionsDTO.Request): Promise<FindAllTransactionsDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber' || key == 'export') continue;

            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        let transactions: ITransaction[];

        if (!req.export) {
            const transactionsFound = await this.transactionRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber);
            if (transactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }
            transactions = transactionsFound.getValue()!;
        } else {
            const transactionsFound = await this.transactionRepo.search(parameterNames, parameterValues, req.sortBy, req.order, 10000000, 1);
            if (transactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }
            transactions = transactionsFound.getValue()!;
        }

        if (req.export) {
            const xlsxGenerated = await this.xlsxService.convert(transactions.map(t => {
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
                    'Статус': transaction.disabled ? 'Отключена' : 'Включена',
                    'Источник': transaction.context.toString() || '-'
                };
            }));
            if (xlsxGenerated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
            }
    
            const xlsx = xlsxGenerated.getValue()!;

            return Result.ok({transactions: xlsx as any, count: -1});
        }

        const countFound = await this.transactionRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({transactions, count});
    }
}
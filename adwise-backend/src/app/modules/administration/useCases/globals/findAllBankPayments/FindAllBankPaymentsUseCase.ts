import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllBankPaymentsDTO } from "./FindAllBankPaymentsDTO";
import { findAllBankPaymentsErrors } from "./findAllBankPaymentsErrors";

export class FindAllBankPaymentsUseCase implements IUseCase<FindAllBankPaymentsDTO.Request, FindAllBankPaymentsDTO.Response> {
    private administrationValidationService: IAdministrationValidationService;
    private transactionRepo: ITransactionRepo;

    public errors = findAllBankPaymentsErrors;

    constructor(administrationValidationService: IAdministrationValidationService, transactionRepo: ITransactionRepo) {
        this.administrationValidationService = administrationValidationService;
        this.transactionRepo = transactionRepo;
    }

    public async execute(req: FindAllBankPaymentsDTO.Request): Promise<FindAllBankPaymentsDTO.Response> {
        const valid = administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const transactionsFound = await this.transactionRepo.findManyByOriginsAndTypes(['split', 'safe'], 'correct', req.sortBy, req.order, req.pageSize, req.pageNumber);
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!;

        const transactionsCounted = await this.transactionRepo.countManyByOriginsAndTypes(['split', 'safe'], 'correct');
        if (transactionsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting transactions'));
        }

        const count = transactionsCounted.getValue()!;

        return Result.ok({bankPayments: transactions, count});
    }
}
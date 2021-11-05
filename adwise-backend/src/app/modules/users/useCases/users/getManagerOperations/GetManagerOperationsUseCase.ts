import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserValidationService } from "../../../services/userValidationService/IUserValidationService";
import { GetManagerOperationsDTO } from "./GetManagerOperationsDTO";
import { getManagerOperationsErrors } from "./getManagerOperationsErrors";

export class GetManagerOperationsUseCase implements IUseCase<GetManagerOperationsDTO.Request, GetManagerOperationsDTO.Response> {
    private userRepo: IUserRepo;
    private transactionRepo: ITransactionRepo;
    private userValidationService: IUserValidationService;

    public errors = getManagerOperationsErrors;

    constructor(userRepo: IUserRepo, transactionRepo: ITransactionRepo, userValidationService: IUserValidationService) {
        this.userRepo = userRepo;
        this.transactionRepo = transactionRepo;
        this.userValidationService = userValidationService;
    }

    public async execute(req: GetManagerOperationsDTO.Request): Promise<GetManagerOperationsDTO.Response> {
        const valid = this.userValidationService.getManagerOperationsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const transactionsFound = await this.transactionRepo.findByTo(user.wallet.toString());
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!;

        const count = transactions.length;

        const operations: GetManagerOperationsDTO.IManagerOperation[] = [];

        let i = (req.page - 1) * req.limit;
        let j = i + req.limit;

        for (i; i < j && i < transactions.length; i++) {
            const transaction = transactions[i];
            
            operations.push({
                organization: transaction.organization,
                sum: transaction.sum,
                timestamp: transaction.timestamp,
                type: transaction.type as any
            });
        }

        return Result.ok({operations, count});
    }
}
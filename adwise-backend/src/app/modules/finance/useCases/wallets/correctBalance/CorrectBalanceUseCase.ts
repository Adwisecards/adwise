import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { CorrectBalanceDTO } from "./CorrectBalanceDTO";
import { correctBalanceErrors } from "./correctBalanceErrors";

export class CorrectBalanceUseCase implements IUseCase<CorrectBalanceDTO.Request, CorrectBalanceDTO.Response> {
    private walletRepo: IWalletRepo;
    private createTransactionUseCase: CreateTransactionUseCase;

    public errors = [
        ...correctBalanceErrors
    ];

    constructor(walletRepo: IWalletRepo, createTransactionUseCase: CreateTransactionUseCase) {
        this.walletRepo = walletRepo;
        this.createTransactionUseCase = createTransactionUseCase;
    }

    public async execute(req: CorrectBalanceDTO.Request): Promise<CorrectBalanceDTO.Response> {
        if (!Types.ObjectId.isValid(req.walletId)) {
            return Result.fail(UseCaseError.create('c', 'walletId is not valid'));
        }

        const walletFound = await this.walletRepo.findById(req.walletId);
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = await walletFound.getValue()!.populate('user organization').execPopulate();

        if (req.change >= 0) {
            const transactionCreated = await this.createTransactionUseCase.execute({
                from: undefined as any,
                currency: wallet.currency,
                sum: req.change,
                to: wallet._id,
                type: req.type == 'cashback' ? 'correctCashback' : 'correctBonus',
                organization: wallet.organization as any,
                user: wallet.user as any,
                frozen: false
            });

            if (transactionCreated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon creating transaction'))
            }

        } else {
            const transactionCreated = await this.createTransactionUseCase.execute({
                from: wallet._id,
                currency: wallet.currency,
                sum: Math.abs(req.change),
                to: undefined as any,
                type: req.type == 'cashback' ? 'correctCashback' : 'correctBonus',
                organization: wallet.organization as any,
                user: wallet.user as any,
                frozen: false
            });

            if (transactionCreated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon creating transaction'))
            }
        }

        return Result.ok({walletId: req.walletId});
    }
}
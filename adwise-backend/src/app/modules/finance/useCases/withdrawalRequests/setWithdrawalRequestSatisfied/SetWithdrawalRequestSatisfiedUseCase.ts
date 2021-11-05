import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { cryptoService } from "../../../../../services/cryptoService";
import { ICryptoService } from "../../../../../services/cryptoService/ICryptoService";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IWithdrawalRequestRepo } from "../../../repo/withdrawalRequests/IWithdrawalRequestRepo";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { SetWithdrawalRequestSatisfiedDTO } from "./SetWithdrawalRequestSatisfiedDTO";
import { setWithdrawalRequestSatisfiedErrors } from "./setWithdrawalRequestSatisfiedErrors";

export class SetWithdrawalRequestSatisfiedUseCase implements IUseCase<SetWithdrawalRequestSatisfiedDTO.Request, SetWithdrawalRequestSatisfiedDTO.Response> {
    private withdrawalRequestRepo: IWithdrawalRequestRepo;
    private cryptoService: ICryptoService;
    private createTransactionUseCase: CreateTransactionUseCase;
    private walletRepo: IWalletRepo;
    
    public errors = [
        ...setWithdrawalRequestSatisfiedErrors
    ];

    constructor(withdrawalRequestRepo: IWithdrawalRequestRepo, cryptoService: ICryptoService, createTransactionUseCase: CreateTransactionUseCase, walletRepo: IWalletRepo) {
        this.withdrawalRequestRepo = withdrawalRequestRepo;
        this.cryptoService = cryptoService;
        this.walletRepo = walletRepo;
        this.createTransactionUseCase = createTransactionUseCase;
    }

    public async execute(req: SetWithdrawalRequestSatisfiedDTO.Request): Promise<SetWithdrawalRequestSatisfiedDTO.Response> {
        if (!Types.ObjectId(req.withdrawalRequestId)) {
            return Result.fail(UseCaseError.create('c', 'withdrawalRequestId is not valid'));
        }

        const withdrawalRequestFound = await this.withdrawalRequestRepo.findById(req.withdrawalRequestId);
        if (withdrawalRequestFound.isFailure) {
            return Result.fail(withdrawalRequestFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding withdrawal request') : UseCaseError.create('3'));
        }

        const withdrawalRequest = await withdrawalRequestFound.getValue()!.populate('organization user').execPopulate();
        
        const walletFound = await this.walletRepo.findById(withdrawalRequest.wallet.toHexString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        if ((wallet.points + wallet.bonusPoints + wallet.cashbackPoints) < withdrawalRequest.sum) {
            return Result.fail(UseCaseError.create('t'));
        }

        const rubForBnbExchanged = await cryptoService.exchangeRubForBnb(withdrawalRequest.sum);
        if (rubForBnbExchanged.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon exchanging RUB for BNB'));
        }

        const bnb = rubForBnbExchanged.getValue()!;

        const transactionCreated = await this.cryptoService.createTransaction(withdrawalRequest.cryptowalletAddress, bnb);
        if (transactionCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating transaction'));
        }

        const transactionHash = transactionCreated.getValue()!;

        withdrawalRequest.transactionHash = transactionHash;
        withdrawalRequest.satisfied = true;

        await this.createTransactionUseCase.execute({
            from: wallet._id,
            currency: wallet.currency,
            sum: withdrawalRequest.sum,
            to: undefined as any,
            type: 'withdrawal',
            context: withdrawalRequest._id,
            organization: withdrawalRequest.organization as any,
            user: withdrawalRequest.user as any,
            frozen: false
        });
        
        const withdrawalRequestSaved = await this.withdrawalRequestRepo.save(withdrawalRequest);
        if (withdrawalRequestSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving withdrawal request'));
        }

        return Result.ok({
            withdrawalRequestId: req.withdrawalRequestId
        });
    }
}
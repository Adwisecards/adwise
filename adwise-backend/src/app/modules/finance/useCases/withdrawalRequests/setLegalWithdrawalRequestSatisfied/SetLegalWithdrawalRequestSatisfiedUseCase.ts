import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITelegramService } from "../../../../../services/telegramService/ITelegramService";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { withdrawalRequestRepo } from "../../../repo/withdrawalRequests";
import { IWithdrawalRequestRepo } from "../../../repo/withdrawalRequests/IWithdrawalRequestRepo";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { SetLegalWithdrawalRequestSatisfiedDTO } from "./SetLegalWithdrawalRequestSatisfiedDTO";
import { setLegalWithdrawalRequestSatisfiedErrors } from "./setLegalWithdrawalRequestSatisfiedErrors";

export class SetLegalWithdrawalRequestSatisfiedUseCase implements IUseCase<SetLegalWithdrawalRequestSatisfiedDTO.Request, SetLegalWithdrawalRequestSatisfiedDTO.Response> {
    private walletRepo: IWalletRepo;
    private telegramService: ITelegramService;
    private organizationRepo: IOrganizationRepo;
    private withdrawalRequestRepo: IWithdrawalRequestRepo;
    private createTransactionUseCase: CreateTransactionUseCase;
    
    public errors = [
        ...setLegalWithdrawalRequestSatisfiedErrors
    ];

    constructor(
        walletRepo: IWalletRepo,
        telegramService: ITelegramService,
        organizationRepo: IOrganizationRepo,
        withdrawalRequestRepo: IWithdrawalRequestRepo, 
        createTransactionUseCase: CreateTransactionUseCase
    ) {
        this.walletRepo = walletRepo;
        this.telegramService = telegramService;
        this.organizationRepo = organizationRepo;
        this.withdrawalRequestRepo = withdrawalRequestRepo;
        this.createTransactionUseCase = createTransactionUseCase;
    }

    public async execute(req: SetLegalWithdrawalRequestSatisfiedDTO.Request): Promise<SetLegalWithdrawalRequestSatisfiedDTO.Response> {
        if (!Types.ObjectId.isValid(req.withdrawalRequestId)) {
            return Result.fail(UseCaseError.create('c', 'withdrawalRequestId is not valid'));
        }

        const withdrawalRequestFound = await this.withdrawalRequestRepo.findById(req.withdrawalRequestId);
        if (withdrawalRequestFound.isFailure) {
            return Result.fail(withdrawalRequestFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding withdrawal request') : UseCaseError.create('3'));
        }

        const withdrawalRequest = await withdrawalRequestFound.getValue()!.populate('organization user').execPopulate();

        const walletFound = await this.walletRepo.findById(withdrawalRequest.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        if ((wallet.points + wallet.cashbackPoints + wallet.bonusPoints) < withdrawalRequest.sum) {
            return Result.fail(UseCaseError.create('t'));
        }

        withdrawalRequest.satisfied = true;

        await this.createTransactionUseCase.execute({
            from: wallet._id,
            currency: wallet.currency,
            sum: withdrawalRequest.sum,
            to: undefined as any,
            type: 'withdrawal',
            context: withdrawalRequest._id,
            user: withdrawalRequest.user as any,
            organization: withdrawalRequest.organization as any,
            frozen: false
        });
        
        const withdrawalRequestSaved = await this.withdrawalRequestRepo.save(withdrawalRequest);
        if (withdrawalRequestSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving withdrawal request'));
        }

        if (withdrawalRequest.organization) {
            await this.telegramService.send('withdrawalSatisfied', {
                organizationName: (<any>withdrawalRequest.organization).name,
                withdrawalSum: withdrawalRequest.sum.toFixed(),
                withdrawalReason: withdrawalRequest.comment,
                withdrawalDate: withdrawalRequest.timestamp.toISOString()
            });
        }

        return Result.ok({
            withdrawalRequestId: req.withdrawalRequestId
        });
    }
}
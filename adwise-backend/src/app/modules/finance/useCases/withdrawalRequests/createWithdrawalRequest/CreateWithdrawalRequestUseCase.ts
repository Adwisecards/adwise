import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IWallet } from "../../../models/Wallet";
import { WithdrawalRequest } from "../../../models/WithdrawalRequest";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IWithdrawalRequestRepo } from "../../../repo/withdrawalRequests/IWithdrawalRequestRepo";
import { IWithdrawalRequestTokenService } from "../../../services/withdrawalRequests/withdrawalRequestTokenService/IWithdrawalRequestTokenService";
import { CreateWithdrawalRequestDTO } from "./CreateWithdrawalRequestDTO";
import { createWithdrawalRequestErrors } from "./createWithdrawalRequestErrors";

export class CreateWithdrawalRequestUseCase implements IUseCase<CreateWithdrawalRequestDTO.Request, CreateWithdrawalRequestDTO.Response> {
    private withdrawalRequestRepo: IWithdrawalRequestRepo;
    private organizationRepo: IOrganizationRepo;
    private walletRepo: IWalletRepo;
    private globalRepo: IGlobalRepo;
    private userRepo: IUserRepo;
    private withdrawalRequestTokenService: IWithdrawalRequestTokenService;
    
    public errors = [
        ...createWithdrawalRequestErrors
    ];

    constructor(withdrawalRequestRepo: IWithdrawalRequestRepo, organizationRepo: IOrganizationRepo, userRepo: IUserRepo, walletRepo: IWalletRepo, withdrawalRequestTokenService: IWithdrawalRequestTokenService, globalRepo: IGlobalRepo) {
        this.withdrawalRequestRepo = withdrawalRequestRepo;
        this.organizationRepo = organizationRepo;
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.withdrawalRequestTokenService = withdrawalRequestTokenService;
        this.globalRepo = globalRepo;
    }

    public async execute(req: CreateWithdrawalRequestDTO.Request): Promise<CreateWithdrawalRequestDTO.Response> {
        if (!Types.ObjectId.isValid(req.taskId)) {
            return Result.fail(UseCaseError.create('c', 'taskId is not valid'));
        }

        const decoded = await this.withdrawalRequestTokenService.decode(req.withdrawalRequestToken);
        if (decoded.isFailure) {
            return Result.fail(UseCaseError.create('c', 'withdrawalRequestToken is not valid'));
        }

        const {userId} = decoded.getValue()!;

        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = await userFound.getValue()!.populate('wallet').execPopulate();

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const task = global.tasks.find(task => task._id.toString() == req.taskId);
        if (!task) {
            return Result.fail(UseCaseError.create('c', 'Task does not exist'));
        }

        if (task.disabled) {
            return Result.fail(UseCaseError.create('c', 'Task is disabled'));
        }

        if (task.points > ((<IWallet>(<any>user.wallet)).points) + (<IWallet>(<any>user.wallet)).bonusPoints + (<IWallet>(<any>user.wallet)).cashbackPoints) {
            return Result.fail(UseCaseError.create('t'));
        }

        const withdrawalRequest = new WithdrawalRequest({
            task: task,
            user: user?._id,
            sum: task.points,
            currency: (<IWallet>(<any>user.wallet)).currency,
            wallet: (<IWallet>(<any>user.wallet))._id,
            cryptowalletAddress: req.cryptowalletAddress
        });

        const withdrawalRequestSaved = await this.withdrawalRequestRepo.save(withdrawalRequest);
        if (withdrawalRequestSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving withdrawal request'));
        }

        return Result.ok({withdrawalRequestId: withdrawalRequest._id});
    }
}
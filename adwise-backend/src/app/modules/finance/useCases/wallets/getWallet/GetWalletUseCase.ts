import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ITransaction } from "../../../models/Transaction";
import { IWallet } from "../../../models/Wallet";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { GetWalletDTO } from "./GetWalletDTO";
import { getWalletErrors } from './getWalletErrors';

interface IObjectWithWallet {
    wallet: string | Types.ObjectId;
}

export class GetWalletUseCase implements IUseCase<GetWalletDTO.Request, GetWalletDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private transactionRepo: ITransactionRepo;

    public errors = getWalletErrors;

    constructor(
        organizationRepo: IOrganizationRepo,
        userRepo: IUserRepo,
        walletRepo: IWalletRepo,
        transactionRepo: ITransactionRepo
    ) {
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.organizationRepo = organizationRepo;
        this.transactionRepo = transactionRepo;
    }

    public async execute(req: GetWalletDTO.Request): Promise<GetWalletDTO.Response> {
        if (typeof req.organization != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'organization is not valid'));
        }

        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const walletGotten = await this.getWallet(req.userId, req.organization);
        if (walletGotten.isFailure) {
            return Result.fail(walletGotten.getError()!);
        }

        const wallet = walletGotten.getValue()!;

        const frozenTransactionsGotten = await this.getFrozenTransactions(wallet._id.toString());
        if (frozenTransactionsGotten.isFailure) {
            return Result.fail(frozenTransactionsGotten.getError());
        }

        const frozenTransactions = frozenTransactionsGotten.getValue()!;

        const frozenTransactionSum = frozenTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        wallet.points += wallet.cashbackPoints + wallet.bonusPoints;
        wallet.cashbackPoints = 0;
        wallet.bonusPoints = 0;
        wallet.frozenPoints.push({
            sum: frozenTransactionSum,
            type: 'bonus',
            timestamp: new Date()
        });

        return Result.ok({wallet});
    }

    private async getFrozenTransactions(walletId: string): Promise<Result<ITransaction[] | null, UseCaseError | null>> {
        const frozenTransactionsFound = await this.transactionRepo.findManyByToAndFrozenAndDisabled(walletId, true, false);
        if (frozenTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding frozen transactions'));
        }

        const frozenTransactions = frozenTransactionsFound.getValue()!;

        return Result.ok(frozenTransactions);
    }

    private async getWallet(userId: string, organization: boolean): Promise<Result<IWallet | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        let objectWithWallet: IObjectWithWallet = user;
        
        if (organization && !user.organization) {
            return Result.fail(UseCaseError.create('c', 'User has no organization'));
        }

        if (organization) {
            const organizationFound = await this.organizationRepo.findById(user.organization.toString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            objectWithWallet = organizationFound.getValue()!;
        }

        const walletFound = await this.walletRepo.findById(objectWithWallet.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding wallet") : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        return Result.ok(wallet);
    }
}
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ITransaction } from "../../../models/Transaction";
import { IWallet } from "../../../models/Wallet";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IWalletValidationService } from "../../../services/wallets/walletValidationService/IWalletValidationService";
import { GetWalletBalanceDTO } from "./GetWalletBalanceDTO";
import { getWalletBalanceErrors } from "./getWalletBalanceErrors";

interface IKeyObjects {
    wallet: IWallet;
    user: IUser;
    frozenTransactions: ITransaction[];
};

export class GetWalletBalanceUseCase implements IUseCase<GetWalletBalanceDTO.Request, GetWalletBalanceDTO.Response> {
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private transactionRepo: ITransactionRepo;
    private walletValidationService: IWalletValidationService;

    public errors = getWalletBalanceErrors;

    constructor(
        userRepo: IUserRepo,
        walletRepo: IWalletRepo,
        transactionRepo: ITransactionRepo,
        walletValidationService: IWalletValidationService
    ) {
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.transactionRepo = transactionRepo;
        this.walletValidationService = walletValidationService;
    }

    public async execute(req: GetWalletBalanceDTO.Request): Promise<GetWalletBalanceDTO.Response> {
        const valid = await this.walletValidationService.getWalletBalanceData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.walletId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            user,
            wallet,
            frozenTransactions
        } = keyObjectsGotten.getValue()!;

        const isUserOwner = this.checkAccess(wallet, user);
        if (!isUserOwner) {
            return Result.fail(UseCaseError.create('d', 'Access is forbidden'));
        } 

        const points = wallet.points + wallet.bonusPoints + wallet.cashbackPoints;
        const frozenPoints = frozenTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        return Result.ok({
            currency: wallet.currency,
            frozenPoints: Number(frozenPoints.toFixed(2)),
            points: Number(points.toFixed(2))
        });
    }

    private checkAccess(wallet: IWallet, user: IUser): boolean {
        if (wallet.organization) {
            if (user.organization?.toString() != wallet.organization.toString()) {
                return false;
            }
        }

        if (wallet.user) {
            if (wallet.user.toString() != user._id.toString()) {
                return false;
            }
        }

        return true;
    }

    private async getKeyObjects(userId: string, walletId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const walletFound = await this.walletRepo.findById(walletId);
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        const frozenTransactionsFound = await this.transactionRepo.findManyByToAndFrozenAndDisabled(wallet._id.toString(), true, false);
        if (frozenTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding frozen transactions'));
        } 

        const frozenTransactions = frozenTransactionsFound.getValue()!;

        return Result.ok({
            user,
            wallet,
            frozenTransactions
        });
    }
}
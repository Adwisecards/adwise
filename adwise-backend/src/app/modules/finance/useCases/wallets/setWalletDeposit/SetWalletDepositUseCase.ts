import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IWallet } from "../../../models/Wallet";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IWalletValidationService } from "../../../services/wallets/walletValidationService/IWalletValidationService";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { RecalculateWalletBalanceUseCase } from "../recalculateWalletBalance/RecalculateWalletBalanceUseCase";
import { SetWalletDepositDTO } from "./SetWalletDepositDTO";
import { setWalletDepositErrors } from "./setWalletDepositErrors";
import * as uuid from 'uuid';

interface IKeyObjects {
    wallet: IWallet;
    user: IUser;
    organization?: IOrganization;
};

export class SetWalletDepositUseCase implements IUseCase<SetWalletDepositDTO.Request, SetWalletDepositDTO.Response> {
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private organizationRepo: IOrganizationRepo;
    private walletValidationService: IWalletValidationService;
    private createTransactionUseCase: CreateTransactionUseCase;

    public errors = setWalletDepositErrors;

    constructor(
        userRepo: IUserRepo,
        walletRepo: IWalletRepo,
        organizationRepo: IOrganizationRepo,
        walletValidationService: IWalletValidationService,
        createTransactionUseCase: CreateTransactionUseCase,
    ) {
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.organizationRepo = organizationRepo;
        this.walletValidationService = walletValidationService;
        this.createTransactionUseCase = createTransactionUseCase;
    }

    public async execute(req: SetWalletDepositDTO.Request): Promise<SetWalletDepositDTO.Response> {
        const valid = this.walletValidationService.setWalletDepositData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.walletId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            user,
            wallet,
            organization
        } = keyObjectsGotten.getValue()!;

        if (!organization) {
            return Result.fail(UseCaseError.create('c', 'User is not organization owner'));
        }

        if (organization.wallet.toString() != wallet._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'Wallet is not of organization'));
        }

        if (organization.user.toString() != user._id.toString() && !req.isAdmin) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        if (req.deposit > 0 && wallet.points < req.deposit) {
            return Result.fail(UseCaseError.create('t'));
        }

        if (req.deposit < 0 && wallet.deposit < Math.abs(req.deposit)) {
            return Result.fail(UseCaseError.create('t'));
        }

        let context = uuid.v4();

       if (req.deposit < 0) {
            await this.createTransactionUseCase.execute({
                currency: wallet.currency,
                from: wallet._id.toString(),
                to: undefined as any,
                sum: Math.abs(req.deposit),
                frozen: false,
                type: 'depositBack',
                organization: organization,
                origin: 'online',
                context: context
            });

            await this.createTransactionUseCase.execute({
                currency: wallet.currency,
                from: undefined as any,
                to: wallet._id.toString(),
                sum: Math.abs(req.deposit),
                frozen: false,
                type: 'depositBack',
                organization: organization,
                origin: 'online',
                context: context
            });
       } else {
            await this.createTransactionUseCase.execute({
                currency: wallet.currency,
                from: wallet._id.toString(),
                to: undefined as any,
                sum: Math.abs(req.deposit),
                frozen: false,
                type: 'deposit',
                organization: organization,
                origin: 'online',
                context: context
            });

            await this.createTransactionUseCase.execute({
                currency: wallet.currency,
                from: undefined as any,
                to: wallet._id.toString(),
                sum: Math.abs(req.deposit),
                frozen: false,
                type: 'deposit',
                organization: organization,
                origin: 'online',
                context: context
            });
       }

        return Result.ok({walletId: req.walletId});
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

        let organization: IOrganization | undefined;

        if (wallet.organization) {
            const organizationFound = await this.organizationRepo.findById(wallet.organization.toString());
            if (organizationFound.isSuccess) {
                organization = organizationFound.getValue()!;
            }
        }

        return Result.ok({
            user,
            wallet,
            organization
        });
    }
}
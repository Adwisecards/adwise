import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IWallet } from "../../../models/Wallet";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { DepositWalletDTO } from "./DepositWalletDTO";
import { depositWalletErrors } from "./depositWalletErrors";

export class DepositWalletUseCase implements IUseCase<DepositWalletDTO.Request, DepositWalletDTO.Response> {
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private organizationRepo: IOrganizationRepo;
    private createTransactionUseCase: CreateTransactionUseCase;
    public errors: UseCaseError[] = [
        ...depositWalletErrors
    ];
    
    constructor(userRepo: IUserRepo, walletRepo: IWalletRepo, organizationRepo: IOrganizationRepo, createTransactionUseCase: CreateTransactionUseCase) {
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.organizationRepo = organizationRepo;
        this.createTransactionUseCase = createTransactionUseCase;
    }

    public async execute(req: DepositWalletDTO.Request): Promise<DepositWalletDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId) || req.sumInPoints < 0) {
            return Result.fail(UseCaseError.create('c', 'User ID must be valid and sum in points must be greater than 0'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        let wallet: IWallet;
        if (user.organization) {
            const organizationFound = await this.organizationRepo.findById(user.organization.toHexString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            const organization = organizationFound.getValue()!;
            
            const walletFound = await this.walletRepo.findById(organization.wallet.toHexString());
            if (walletFound.isFailure) {
                return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
            }

            wallet = walletFound.getValue()!;
        } else {
            const walletFound = await this.walletRepo.findById(user.wallet.toHexString());
            if (walletFound.isFailure) {
                return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
            }

            wallet = walletFound.getValue()!;
        }

        await this.createTransactionUseCase.execute({
            from: wallet._id,
            currency: wallet.currency,
            sum: req.sumInPoints,
            to: undefined as any,
            type: 'deposit',
            frozen: false
        });

        const walletSaved = await this.walletRepo.save(wallet);
        if (walletSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving wallet'));
        }

        return Result.ok({walletId: wallet._id});
    }
}
import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IWallet } from "../../../models/Wallet";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { CreatePaymentUseCase } from "../../payments/createPayment/CreatePaymentUseCase";
import { PayDepositWalletDTO } from "./PayDepositWalletDTO";
import { payDepositWalletErrors } from "./payDepositWalletErrors";

export class PayDepositWalletUseCase implements IUseCase<PayDepositWalletDTO.Request, PayDepositWalletDTO.Response> {
    private walletRepo: IWalletRepo;
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private createPaymentUseCase: CreatePaymentUseCase;

    public errors = [
        ...payDepositWalletErrors
    ];

    constructor(walletRepo: IWalletRepo, userRepo: IUserRepo, organizationRepo: IOrganizationRepo, createPaymentUseCase: CreatePaymentUseCase) {
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.walletRepo = walletRepo;
        this.createPaymentUseCase = createPaymentUseCase;
    }

    public async execute(req: PayDepositWalletDTO.Request): Promise<PayDepositWalletDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        if (req.sum < 1) {
            return Result.fail(UseCaseError.create('c', 'sum is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
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

        const paymentCreated = await this.createPaymentUseCase.execute({
            type: 'deposit',
            currency: wallet!.currency,
            ref: wallet!._id.toString(),
            sum: req.sum,
            usedPoints: 0,
            shopId: ''
        });
        if (paymentCreated.isFailure) {
            return Result.fail(paymentCreated.getError()!);
        }

        const {payment} = paymentCreated.getValue()!;
        return Result.ok({payment});
    }
}
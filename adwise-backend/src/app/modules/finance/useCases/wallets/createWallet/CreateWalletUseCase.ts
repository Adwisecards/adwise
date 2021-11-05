import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import Currency from "../../../../../core/static/Currency";
import { WalletModel } from "../../../models/Wallet";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IWalletValidationService } from "../../../services/wallets/walletValidationService/IWalletValidationService";
import { CreateWalletDTO } from "./CreateWalletDTO";
import { createWalletErrors } from "./createWalletErrors";

export class CreateWalletUseCase implements IUseCase<CreateWalletDTO.Request, CreateWalletDTO.Response> {
    private walletRepo: IWalletRepo;
    private walletValidationService: IWalletValidationService;

    public errors = createWalletErrors;

    constructor(
        walletRepo: IWalletRepo,
        walletValidationService: IWalletValidationService
    ) {
        this.walletRepo = walletRepo;
        this.walletValidationService = walletValidationService;
    }

    public async execute(req: CreateWalletDTO.Request): Promise<CreateWalletDTO.Response> {
        const valid = this.walletValidationService.createWalletData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const wallet = new WalletModel({
            currency: req.currency,
            user: req.userId,
            organization: req.organizationId,
            new: true
        });

        console.log(wallet);

        const walletSaved = await this.walletRepo.save(wallet);
        if (walletSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving wallet'));
        }

        return Result.ok({walletId: wallet._id.toString()});
    }
}
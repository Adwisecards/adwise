import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { CurrencyService } from "../../../../../services/currencyService/implementation/CurrencyService";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { CreateTransactionUseCase } from "../../../../finance/useCases/transactions/createTransaction/CreateTransactionUseCase";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { DistributePointsFromPacketDTO } from "./DistributePointsFromPacketDTO";
import { distributePointsFromPacketErrors } from "./distributePointsFromPacketErrors";

export class DistributePointsFromPacketUseCase implements IUseCase<DistributePointsFromPacketDTO.Request, DistributePointsFromPacketDTO.Response> {
    private walletRepo: IWalletRepo;
    private userRepo: IUserRepo;
    private globalRepo: IGlobalRepo;
    private createTransactionUseCase: CreateTransactionUseCase;
    private currencyService: CurrencyService;
    public errors = [
        ...distributePointsFromPacketErrors
    ];

    constructor(walletRepo: IWalletRepo, userRepo: IUserRepo, globalRepo: IGlobalRepo, createTransactionUseCase: CreateTransactionUseCase, currencyService: CurrencyService) {
        this.walletRepo = walletRepo;
        this.userRepo = userRepo;
        this.globalRepo = globalRepo;
        this.createTransactionUseCase = createTransactionUseCase;
        this.currencyService = currencyService;
    }

    public async execute(req: DistributePointsFromPacketDTO.Request): Promise<DistributePointsFromPacketDTO.Response> {
        if (req.userId && !Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        if (!req.count) req.count = 1;

        if (!req.userId || req.count > 5) {
            return Result.ok({
                context: req.context,
                refBonus: req.refBonus,
                userId: req.userId
            });
        }

        const globalFound = await this.globalRepo.getGlobal();
        if (globalFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalFound.getValue()!;

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const walletFound = await this.walletRepo.findById(user.wallet.toHexString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('r'));
        }
    
        const wallet = walletFound.getValue()!;

        let refBonus = req.refBonus;

        await this.createTransactionUseCase.execute({
            currency: wallet.currency,
            from: undefined as any,
            to: wallet._id,
            type: 'packetRef',
            sum: refBonus,
            context: req.context,
            frozen: false
        });

        const walletSaved = await this.walletRepo.save(wallet);
        if (walletSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving wallet'));
        }

        return await this.execute({
            userId: user.parent ? user.parent.toHexString() : '',
            refBonus: req.refBonus,
            context: req.context,
            currency: req.currency,
            count: req.count ? req.count + 1 : 2,
        });
    }
}
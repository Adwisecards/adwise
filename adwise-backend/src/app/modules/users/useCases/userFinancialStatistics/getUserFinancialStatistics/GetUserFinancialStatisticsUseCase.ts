import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { IUserFinancialStatistics, UserFinancialStatisticsModel } from "../../../models/UserFinancialStatistics";
import { IUserFinancialStatisticsRepo } from "../../../repo/userFinancialStatistics/IUserFinancialStatisticsRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { getUserFinancialStatisticsErrors } from "../../users/getUserFinancialStatistics/getUserFinancialStatisticsErrors";
import { UpdateUserFinancialStatisticsUseCase } from "../updateUserFinancialStatistics/UpdateUserFinancialStatisticsUseCase";
import { GetUserFinancialStatisticsDTO } from "./GetUserFinancialStatisticsDTO";

export class GetUserFinancialStatisticsUseCase implements IUseCase<GetUserFinancialStatisticsDTO.Request, GetUserFinancialStatisticsDTO.Response> {
    private updateUserFinancialStatisticsUseCase: UpdateUserFinancialStatisticsUseCase;
    private userFinancialStatisticsRepo: IUserFinancialStatisticsRepo;
    private walletRepo: IWalletRepo;
    private userRepo: IUserRepo;

    public errors = getUserFinancialStatisticsErrors;

    constructor(
        updateUserFinancialStatisticsUseCase: UpdateUserFinancialStatisticsUseCase,
        userFinancialStatisticsRepo: IUserFinancialStatisticsRepo, 
        walletRepo: IWalletRepo, 
        userRepo: IUserRepo
    ) {
        this.updateUserFinancialStatisticsUseCase = updateUserFinancialStatisticsUseCase;
        this.userFinancialStatisticsRepo = userFinancialStatisticsRepo;
        this.walletRepo = walletRepo;
        this.userRepo = userRepo;
    }

    public async execute(req: GetUserFinancialStatisticsDTO.Request): Promise<GetUserFinancialStatisticsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        if (!req.noUpdate) {
            const userFinancialStatisticsUpdated = await this.updateUserFinancialStatisticsUseCase.execute({
                userId: req.userId
            });
    
            if (userFinancialStatisticsUpdated.isFailure) {
                console.log(userFinancialStatisticsUpdated.getError());
                return Result.fail(UseCaseError.create('a', 'Error upon updating user financial statistics'));
            }
        }

        const userFinancialStatisticsFound = await this.userFinancialStatisticsRepo.findByUser(req.userId);
        if (userFinancialStatisticsFound.isFailure && userFinancialStatisticsFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user financial statistics'));
        }

        let userFinancialStatistics: IUserFinancialStatistics;

        if (userFinancialStatisticsFound.isFailure && userFinancialStatisticsFound.getError()!.code == 404) {
            userFinancialStatistics = new UserFinancialStatisticsModel({
                user: req.userId,
                bonusSum: 0,
                purchaseSum: 0,
                refCount: 0,
                marketingSum: 0,
                usedPointsSum: 0,
                withdrawalSum: 0,
                managerPercentSum: 0,
                operations: [],
                purchases: []
            });

            const userFinancialStatisticsSaved = await this.userFinancialStatisticsRepo.save(userFinancialStatistics);
            if (userFinancialStatisticsSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user financial statistics'));
            }
        } else {
            userFinancialStatistics = userFinancialStatisticsFound.getValue()!;
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const walletFound = await this.walletRepo.findById(user.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        wallet.points += wallet.cashbackPoints + wallet.bonusPoints;

        wallet.cashbackPoints = 0;
        wallet.bonusPoints = 0

        userFinancialStatistics.operations = userFinancialStatistics.operations.slice(0, 30);

        return Result.ok({...userFinancialStatistics.toObject(), wallet});
    }
}
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IWithdrawalRequestTokenService } from "../../../services/withdrawalRequests/withdrawalRequestTokenService/IWithdrawalRequestTokenService";
import { GetWithdrawalRequestDataDTO } from "./GetWithdrawalRequestDataDTO";
import { getWithdrawalRequestDataErrors } from "./getWithdrawalRequestDataErrors";

export class GetWithdrawalRequestDataUseCase implements IUseCase<GetWithdrawalRequestDataDTO.Request, GetWithdrawalRequestDataDTO.Response> {
    private globalRepo: IGlobalRepo;
    private userRepo: IUserRepo;
    private withdrawalRequestTokenService: IWithdrawalRequestTokenService;

    public errors = [
        ...getWithdrawalRequestDataErrors
    ];

    constructor(globalRepo: IGlobalRepo, userRepo: IUserRepo, withdrawalRequestTokenService: IWithdrawalRequestTokenService) {
        this.globalRepo = globalRepo;
        this.userRepo = userRepo;
        this.withdrawalRequestTokenService = withdrawalRequestTokenService;
    }

    public async execute(req: GetWithdrawalRequestDataDTO.Request): Promise<GetWithdrawalRequestDataDTO.Response> {
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

        (<any>user).wallet.points = (<any>user).wallet.cashbackPoints + (<any>user).wallet.bonusPoints;
        (<any>user).wallet.cashbackPoints = 0;
        (<any>user).wallet.bonusPoints = 0;

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        return Result.ok({
            tasks: global.tasks,
            user: user
        });
    }
}
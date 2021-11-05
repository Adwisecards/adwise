import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IWithdrawalRequestTokenService } from "../../../services/withdrawalRequests/withdrawalRequestTokenService/IWithdrawalRequestTokenService";
import { createWithdrawalRequestErrors } from "../createWithdrawalRequest/createWithdrawalRequestErrors";
import { CreateWithdrawalRequestTokenDTO } from "./CreateWithdrawalRequestTokenDTO";

export class CreateWithdrawalRequestTokenUseCase implements IUseCase<CreateWithdrawalRequestTokenDTO.Request, CreateWithdrawalRequestTokenDTO.Response> {
    private userRepo: IUserRepo;
    private withdrawalRequestTokenService: IWithdrawalRequestTokenService;
    
    public errors = [
        ...createWithdrawalRequestErrors
    ];

    constructor(userRepo: IUserRepo, withdrawalRequestTokenService: IWithdrawalRequestTokenService) {
        this.userRepo = userRepo;
        this.withdrawalRequestTokenService = withdrawalRequestTokenService;
    }

    public async execute(req: CreateWithdrawalRequestTokenDTO.Request): Promise<CreateWithdrawalRequestTokenDTO.Response> {
        if (!Types.ObjectId(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const tokenSigned = await this.withdrawalRequestTokenService.sign({
            userId: user._id.toString()
        });
        if (tokenSigned.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon signing token'));
        }

        const token = tokenSigned.getValue()!;

        return Result.ok({
            withdrawalRequestToken: token
        })
    }
}
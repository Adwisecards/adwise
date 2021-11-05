import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { GetUserByWisewinIdDTO } from "./GetUserByWisewinIdDTO";
import { getUserByWisewinIdErrors } from "./getUserByWisewinIdErrors";

export class GetUserByWisewinIdUseCase implements IUseCase<GetUserByWisewinIdDTO.Request, GetUserByWisewinIdDTO.Response> {
    private userRepo: IUserRepo;
    public errors = [
        ...getUserByWisewinIdErrors
    ];

    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo;
    }

    public async execute(req: GetUserByWisewinIdDTO.Request): Promise<GetUserByWisewinIdDTO.Response> {
        if (!req.wisewinId) {
            return Result.fail(UseCaseError.create('c', 'wisewinId is not valid'));
        }

        const userFound = await this.userRepo.findByWinwiseId(req.wisewinId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('b', 'User does not exist'));
        }

        const user = userFound.getValue()!;
        user.password = '';

        return Result.ok({user});
    }
}
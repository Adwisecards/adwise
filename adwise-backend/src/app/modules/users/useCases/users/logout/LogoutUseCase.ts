import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { LogoutDTO } from "./LogoutDTO";
import { logoutErrors } from "./logoutErrors";

export class LogoutUseCase implements IUseCase<LogoutDTO.Request, LogoutDTO.Response> {
    private userRepo: IUserRepo;

    public errors = logoutErrors;

    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo;
    }

    public async execute(req: LogoutDTO.Request): Promise<LogoutDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        user.deviceToken = '';
        user.pushToken = '';
        user.pushTokenBusiness = '';
        user.deviceTokenBusiness = '';

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({
            userId: req.userId
        });
    }
}
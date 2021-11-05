import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IRestorationRepo } from "../../../repo/restorations/IRestorationRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { RestorePasswordDTO } from "./RestorePasswordDTO";
import { restorePasswordErrors } from "./restorePasswordErrors";

export class RestorePasswordUseCase implements IUseCase<RestorePasswordDTO.Request, RestorePasswordDTO.Response> {
    private userRepo: IUserRepo;
    private restorationRepo: IRestorationRepo;
    public errors: UseCaseError[] = [
        ...restorePasswordErrors
    ];
    constructor(userRepo: IUserRepo, restorationRepo: IRestorationRepo) {
        this.restorationRepo = restorationRepo;
        this.userRepo = userRepo;
    }

    public async execute(req: RestorePasswordDTO.Request): Promise<RestorePasswordDTO.Response> {
        if (!Types.ObjectId.isValid(req.restorationId) || !req.password || req.password.length < 6) {
            return Result.fail(UseCaseError.create('c'));
        }

        const restorationFound = await this.restorationRepo.findById(req.restorationId);
        if (restorationFound.isFailure) {
            return Result.fail(restorationFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const restoration = restorationFound.getValue()!;
        if (!restoration.confirmed) {
            return Result.fail(UseCaseError.create('k'));
        }

        const userFound = await this.userRepo.findById(restoration.user.toHexString());
        if (userFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
        }

        const user = userFound.getValue()!;
        user.password = req.password;

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        await this.restorationRepo.deleteById(req.restorationId);
        return Result.ok({restorationId: req.restorationId});
    }
}
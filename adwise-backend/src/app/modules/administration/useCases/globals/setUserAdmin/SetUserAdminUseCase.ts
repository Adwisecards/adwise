import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";

import { SetUserAdminDTO } from "./SetUserAdminDTO";
import { setUserAdminErrors } from "./setUserAdminErrors";

export class SetUserAdminUseCase implements IUseCase<SetUserAdminDTO.Request, SetUserAdminDTO.Response> {
    private userRepo: IUserRepo;
    public errors = [
        ...setUserAdminErrors
    ];

    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo;
    }

    public async execute(req: SetUserAdminDTO.Request): Promise<SetUserAdminDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId) || typeof req.admin != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('b', 'User does not exist'));
        }

        const user = userFound.getValue()!;

        if (user.adminGuest) {
            user.adminGuest = false;
        }

        user.admin = req.admin;

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({userId: user._id});
    }
}
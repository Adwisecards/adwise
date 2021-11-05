import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import UserRole from "../../../../../core/static/UserRole";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { SetUserRoleDTO } from "./SetUserRoleDTO";
import { setUserRoleErrors } from "./setUserRoleErrors";

export class SetUserRoleUseCase implements IUseCase<SetUserRoleDTO.Request, SetUserRoleDTO.Response> {
    private userRepo: IUserRepo;

    public errors = setUserRoleErrors;

    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo;
    }

    public async execute(req: SetUserRoleDTO.Request): Promise<SetUserRoleDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        if (!UserRole.isValid(req.role)) {
            return Result.fail(UseCaseError.create('c', 'role is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
           return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }
        
        const user = userFound.getValue()!;

        user.role = req.role;

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({userId: req.userId});
    }
}
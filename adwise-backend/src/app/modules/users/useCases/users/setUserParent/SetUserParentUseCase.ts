import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../models/User";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserValidationService } from "../../../services/userValidationService/IUserValidationService";
import { SetUserParentDTO } from "./SetUserParentDTO";
import { setUserParentErrors } from "./setUserParentErrors";

interface IKeyObjects {
    user: IUser;
    parentUser: IUser;
};

export class SetUserParentUseCase implements IUseCase<SetUserParentDTO.Request, SetUserParentDTO.Response> {
    private userRepo: IUserRepo;
    private userValidationService: IUserValidationService;

    public errors = setUserParentErrors;

    constructor(
        userRepo: IUserRepo,
        userValidationService: IUserValidationService
    ) {
        this.userRepo = userRepo;
        this.userValidationService = userValidationService;
    }

    public async execute(req: SetUserParentDTO.Request): Promise<SetUserParentDTO.Response> {
        const valid = await this.userValidationService.setUserParentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.parentUserId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            parentUser,
            user
        } = keyObjectsGotten.getValue()!;

        user.parent = parentUser._id;

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({
            userId: req.userId
        });
    }

    private async getKeyObjects(userId: string, parentUserId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('l', 'User does not exist'));
        }

        const user = userFound.getValue()!;

        const parentUserFound = await this.userRepo.findById(parentUserId);
        if (parentUserFound.isFailure) {
            return Result.fail(parentUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding parent user') : UseCaseError.create('l', 'Parent user does not exist'));
        }

        const parentUser = parentUserFound.getValue()!;

        return Result.ok({
            parentUser,
            user
        });
    }
}
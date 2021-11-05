import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IAuthService } from "../../../services/authService/IAuthService";
import { GetUserJwtDTO } from "./GetUserJwtDTO";
import { getUserJwtErrors } from "./getUserJwtErrors";

export class GetUserJwtUseCase implements IUseCase<GetUserJwtDTO.Request, GetUserJwtDTO.Response> {
    private userRepo: IUserRepo;
    private authService: IAuthService;

    public errors = [
        ...getUserJwtErrors
    ];

    constructor(userRepo: IUserRepo, authService: IAuthService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }

    public async execute(req: GetUserJwtDTO.Request): Promise<GetUserJwtDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const jwtCreated = await this.authService.sign({
            admin: user.admin,
            userId: user._id,
            adminGuest: user.adminGuest
        });
        if (jwtCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon signing JWT'));
        }

        const jwt = jwtCreated.getValue()!;

        return Result.ok({
            jwt
        });
    }
}
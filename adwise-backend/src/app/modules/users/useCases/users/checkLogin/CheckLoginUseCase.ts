import MyRegexp from "myregexp";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { CheckLoginDTO } from "./CheckLoginDTO";
import { checkLoginErrors } from "./checkLoginErrors";

export class CheckLoginUseCase implements IUseCase<CheckLoginDTO.Request, CheckLoginDTO.Response> {
    private userRepo: IUserRepo;
    public errors: UseCaseError[] = [
        ...checkLoginErrors
    ];
    constructor(userRepo: IUserRepo) {
        this.userRepo = userRepo;
    }

    public async execute(req: CheckLoginDTO.Request): Promise<CheckLoginDTO.Response> {
        if (!MyRegexp.emailOrPhone().test(req.login)) {
            return Result.fail(UseCaseError.create('c', 'Login must either be a valid phone or email address'));
        }

        if (MyRegexp.phone().test(req.login)) {
            const userFound = await this.userRepo.findByPhone(req.login);
            if (userFound.isSuccess) {
                return Result.ok({exists: true});
            }
        } else {
            const userFound = await this.userRepo.findByEmail(req.login);
            if (userFound.isSuccess) {
                return Result.ok({exists: true});
            }
        }

        return Result.ok({exists: false});
    }
}
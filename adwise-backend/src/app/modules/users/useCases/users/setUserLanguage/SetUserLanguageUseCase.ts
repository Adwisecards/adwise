import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserValidationService } from "../../../services/userValidationService/IUserValidationService";
import { SetUserLanguageDTO } from "./SetUserLanguageDTO";
import { setUserLanguageErrors } from "./setUserLanguageErrors";

export class SetUserLanguageUseCase implements IUseCase<SetUserLanguageDTO.Request, SetUserLanguageDTO.Response> {
    private userRepo: IUserRepo;
    private userValidationService: IUserValidationService;

    public errors = setUserLanguageErrors;

    constructor(
        userRepo: IUserRepo,
        userValidationService: IUserValidationService
    ) {
        this.userRepo = userRepo;
        this.userValidationService = userValidationService;
    }

    public async execute(req: SetUserLanguageDTO.Request): Promise<SetUserLanguageDTO.Response> {
        const valid = this.userValidationService.setUserLanguageData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        user.language = req.language;

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
        }

        return Result.ok({
            userId: req.userId
        });
    }
}
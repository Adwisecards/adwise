import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { setUserAdminErrors } from "../setUserAdmin/setUserAdminErrors";
import { SetUserAdminGuestDTO } from "./SetUserAdminGuestDTO";

export class SetUserAdminGuestUseCase implements IUseCase<SetUserAdminGuestDTO.Request, SetUserAdminGuestDTO.Response> {
    private userRepo: IUserRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = setUserAdminErrors;

    constructor(
        userRepo: IUserRepo,
        administrationValidationService: IAdministrationValidationService
    ) {
        this.userRepo = userRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: SetUserAdminGuestDTO.Request): Promise<SetUserAdminGuestDTO.Response> {
        const valid = this.administrationValidationService.setUserAdminGuestData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        if (!user.admin) {
            return Result.fail(UseCaseError.create('d', 'User is not admin'));
        }

        const targetUserFound = await this.userRepo.findById(req.targetUserId);
        if (targetUserFound.isFailure) {
            return Result.fail(targetUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding target user') : UseCaseError.create('m'));
        }

        const targetUser = targetUserFound.getValue()!;

        if (req.adminGuest) {
            targetUser.admin = false;
        }

        targetUser.adminGuest = req.adminGuest;

        const targetUserSaved = await this.userRepo.save(targetUser);
        if (targetUserSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving target user'));
        }

        return Result.ok({
            userId: req.targetUserId
        });
    }
}
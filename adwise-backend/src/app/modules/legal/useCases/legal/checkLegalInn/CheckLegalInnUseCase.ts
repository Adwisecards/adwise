import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ILegalRepo } from "../../../repo/legal/ILegalRepo";
import { ILegalValidationService } from "../../../services/legal/legalValidationService/ILegalValidationService";
import { CheckLegalInnDTO } from "./CheckLegalInnDTO";
import { checkLegalInnErrors } from "./checkLegalInnErrors";

export class CheckLegalInnUseCase implements IUseCase<CheckLegalInnDTO.Request, CheckLegalInnDTO.Response> {
    private legalRepo: ILegalRepo;
    private legalValidationService: ILegalValidationService;

    public errors = checkLegalInnErrors;

    constructor(
        legalRepo: ILegalRepo,
        legalValidationService: ILegalValidationService
    ) {
        this.legalRepo = legalRepo;
        this.legalValidationService = legalValidationService;
    }

    public async execute(req: CheckLegalInnDTO.Request): Promise<CheckLegalInnDTO.Response> {
        const valid = this.legalValidationService.checkLegalInnData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const legalFound = await this.legalRepo.findByInnAndRelevant(req.inn, true);
        if (legalFound.isFailure && legalFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding legal'));
        }

        if (legalFound.isFailure) {
            return Result.ok({exists: false});
        } else {
            return Result.ok({exists: true});
        }
    }
}
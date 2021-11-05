import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IAdvantageRepo } from "../../../repo/advantages/IAdvantageRepo";
import { IAdvantageValidationService } from "../../../services/advantageValidationService/IAdvantageValidationService";
import { GetAdvantagesDTO } from "./GetAdvantagesDTO";
import { getAdvantagesErrors } from "./getAdvantagesErrors";

export class GetAdvantagesUseCase implements IUseCase<GetAdvantagesDTO.Request, GetAdvantagesDTO.Response> {
    private advantageRepo: IAdvantageRepo;
    private advantageValidationService: IAdvantageValidationService;

    public errors = getAdvantagesErrors;

    constructor(
        advantageRepo: IAdvantageRepo,
        advantageValidationService: IAdvantageValidationService
    ) {
        this.advantageRepo = advantageRepo;
        this.advantageValidationService = advantageValidationService;
    }

    public async execute(_: GetAdvantagesDTO.Request): Promise<GetAdvantagesDTO.Response> {
        const advantagesFound = await this.advantageRepo.getAll();
        if (advantagesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting advantages'));
        }

        const advantages = advantagesFound.getValue()!.sort((a, b) => a.index > b.index ? 1 : -1);

        return Result.ok({advantages});
    }
}
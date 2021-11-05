import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { AdvantageModel } from "../../../models/Advantage";
import { IAdvantageRepo } from "../../../repo/advantages/IAdvantageRepo";
import { IAdvantageValidationService } from "../../../services/advantageValidationService/IAdvantageValidationService";
import { CreateAdvantageDTO } from "./CreateAdvantageDTO";
import { createAdvantageErrors } from "./createAdvantageErrors";

export class CreateAdvantageUseCase implements IUseCase<CreateAdvantageDTO.Request, CreateAdvantageDTO.Response> {
    private advantageRepo: IAdvantageRepo;
    private advantageValidationService: IAdvantageValidationService;

    public errors = createAdvantageErrors;

    constructor(
        advantageRepo: IAdvantageRepo,
        advantageValidationService: IAdvantageValidationService
    ) {
        this.advantageRepo = advantageRepo;
        this.advantageValidationService = advantageValidationService;
    }

    public async execute(req: CreateAdvantageDTO.Request): Promise<CreateAdvantageDTO.Response> {
        const valid = this.advantageValidationService.createAdvantageData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const advantage = new AdvantageModel({
            picture: req.pictureMediaId,
            index: req.index,
            name: req.name,
        });

        const advantageSaved = await this.advantageRepo.save(advantage);
        if (advantageSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving advantage'));
        }

        return Result.ok({advantageId: advantage._id.toString()});
    }
}
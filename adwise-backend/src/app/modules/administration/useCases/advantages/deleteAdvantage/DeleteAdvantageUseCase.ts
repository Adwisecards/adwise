import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IAdvantageRepo } from "../../../repo/advantages/IAdvantageRepo";
import { IAdvantageValidationService } from "../../../services/advantageValidationService/IAdvantageValidationService";
import { DeleteAdvantageDTO } from "./DeleteAdvantageDTO";
import { deleteAdvantageErrors } from "./deleteAdvantageErrors";

export class DeleteAdvantageUseCase implements IUseCase<DeleteAdvantageDTO.Request, DeleteAdvantageDTO.Response> {
    private advantageRepo: IAdvantageRepo;
    private advantageValidationService: IAdvantageValidationService;

    public errors = deleteAdvantageErrors;

    constructor(
        advantageRepo: IAdvantageRepo,
        advantageValidationService: IAdvantageValidationService
    ) {
        this.advantageRepo = advantageRepo;
        this.advantageValidationService = advantageValidationService;
    }

    public async execute(req: DeleteAdvantageDTO.Request): Promise<DeleteAdvantageDTO.Response> {
        const valid = this.advantageValidationService.deleteAdvantageData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const advantageFound = await this.advantageRepo.findById(req.advantageId);
        if (advantageFound.isFailure) {
            return Result.fail(advantageFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding advantage') : UseCaseError.create('a6'));
        }

        const advantage = advantageFound.getValue()!;

        const advantageDeleted = await this.advantageRepo.deleteById(advantage._id.toString());
        if (advantageDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting advantage'));
        }

        return Result.ok({
            advantageId: advantage._id.toString()
        });
    }
}
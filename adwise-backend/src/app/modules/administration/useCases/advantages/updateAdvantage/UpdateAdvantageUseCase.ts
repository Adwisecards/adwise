import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IAdvantageRepo } from "../../../repo/advantages/IAdvantageRepo";
import { IAdvantageValidationService } from "../../../services/advantageValidationService/IAdvantageValidationService";
import { UpdateAdvantageDTO } from "./UpdateAdvantageDTO";
import { updateAdvantageErrors } from "./updateAdvantageErrors";

export class UpdateAdvantageUseCase implements IUseCase<UpdateAdvantageDTO.Request, UpdateAdvantageDTO.Response> {
    private advantageRepo: IAdvantageRepo;
    private advantageValidationService: IAdvantageValidationService;

    public errors = updateAdvantageErrors;

    constructor(
        advantageRepo: IAdvantageRepo,
        advantageValidationService: IAdvantageValidationService
    ) {
        this.advantageRepo = advantageRepo;
        this.advantageValidationService = advantageValidationService;
    }

    public async execute(req: UpdateAdvantageDTO.Request): Promise<UpdateAdvantageDTO.Response> {
        const valid = this.advantageValidationService.updateAdvantageData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const advantageFound = await this.advantageRepo.findById(req.advantageId);
        if (advantageFound.isFailure) {
            return Result.fail(advantageFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding advantage') : UseCaseError.create('a6'));
        }

        const advantage = advantageFound.getValue()!;

        for (const key in req) {
            if ((<any>req)[key] != undefined) {
                if (key == 'pictureMediaId') {
                    advantage.picture = (<any>req)[key];
                }

                (<any>advantage)[key] = (<any>req)[key];
            }
        }

        const advantageSaved = await this.advantageRepo.save(advantage);
        if (advantageSaved.isFailure) {
            return Result.fail(UseCaseError.create('a6', 'Error upon saving advantage'));
        }

        return Result.ok({advantageId: advantage._id.toString()});
    }
}
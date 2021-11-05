import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobalRepo } from "../../../repo/globals/IGlobalRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { UpdateGlobalDTO } from "./UpdateGlobalDTO";
import { updateGlobalErrors } from "./updateGlobalErrors";

export class UpdateGlobalUseCase implements IUseCase<UpdateGlobalDTO.Request, UpdateGlobalDTO.Response> {
    private globalRepo: IGlobalRepo;
    private administrationValidationService: IAdministrationValidationService;
    public errors = [
        ...updateGlobalErrors
    ];

    constructor(globalRepo: IGlobalRepo, administrationValidationService: IAdministrationValidationService) {
        this.globalRepo = globalRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: UpdateGlobalDTO.Request): Promise<UpdateGlobalDTO.Response> {
        const valid = this.administrationValidationService.updateGlobalData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const globalFound = await this.globalRepo.getGlobal();
        if (globalFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalFound.getValue()!;

        for (const key in req) {
            (<any>global)[key] = (<any>req)[key];
        }

        const globalSaved = await this.globalRepo.save(global);
        if (globalSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving global'));
        }

        return Result.ok({global});
    }
}
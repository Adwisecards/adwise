import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IVersionRepo } from "../../../repo/versions/IVersionRepo";
import { IVersionValidationService } from "../../../services/versionValidationService/IVersionValidationService";
import { UpdateVersionDTO } from "./UpdateVersionDTO";
import { updateVersionErrors } from './updateVersionErrors';

export class UpdateVersionUseCase implements IUseCase<UpdateVersionDTO.Request, UpdateVersionDTO.Response> {
    private versionRepo: IVersionRepo;
    private versionValidationService: IVersionValidationService;

    public errors = updateVersionErrors;

    constructor(
        versionRepo: IVersionRepo,
        versionValidationService: IVersionValidationService
    ) {
        this.versionRepo = versionRepo;
        this.versionValidationService = versionValidationService;
    }

    public async execute(req: UpdateVersionDTO.Request): Promise<UpdateVersionDTO.Response> {
        const valid = this.versionValidationService.updateVersionData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const versionFound = await this.versionRepo.findById(req.versionId);
        if (versionFound.isFailure) {
            return Result.fail(versionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding version') : UseCaseError.create('a2'));
        }

        const version = versionFound.getValue()!;

        for (const key in req) {
            (<any>version)[key] = (<any>req)[key]; 
        }

        const versionSaved = await this.versionRepo.save(version);
        if (versionSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving version'));
        }

        return Result.ok({versionId: req.versionId});
    }
}
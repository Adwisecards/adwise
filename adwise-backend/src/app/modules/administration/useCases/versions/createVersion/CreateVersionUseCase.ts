import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { VersionModel } from "../../../models/Version";
import { IVersionRepo } from "../../../repo/versions/IVersionRepo";
import { IVersionValidationService } from "../../../services/versionValidationService/IVersionValidationService";
import { CreateVersionDTO } from "./CreateVersionDTO";
import { createVersionErrors } from "./createVersionErrors";

export class CreateVersionUseCase implements IUseCase<CreateVersionDTO.Request, CreateVersionDTO.Response> {
    private versionRepo: IVersionRepo;
    private versionValidationService: IVersionValidationService;

    public errors = createVersionErrors;

    constructor(versionRepo: IVersionRepo, versionValidationService: IVersionValidationService) {
        this.versionRepo = versionRepo;
        this.versionValidationService = versionValidationService;
    } 

    public async execute(req: CreateVersionDTO.Request): Promise<CreateVersionDTO.Response> {
        const valid = this.versionValidationService.createVersionData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const version = new VersionModel({
            type: req.type,
            title: req.title,
            date: req.date,
            comment: req.comment,
            version: req.version
        });

        const versionSaved = await this.versionRepo.save(version);
        if (versionSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving version'));
        }

        return Result.ok({versionId: version._id});
    } 
}
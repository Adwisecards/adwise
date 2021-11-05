import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import VersionType from "../../../../../core/static/VersionType";
import { IVersionRepo } from "../../../repo/versions/IVersionRepo";
import { GetVersionsDTO } from "./GetVersionsDTO";
import { getVersionsErrors } from "./getVersionsErrors";

export class GetVersionsUseCase implements IUseCase<GetVersionsDTO.Request, GetVersionsDTO.Response> {
    private versionRepo: IVersionRepo;

    public errors = getVersionsErrors;

    constructor(versionRepo: IVersionRepo) {
        this.versionRepo = versionRepo;
    }

    public async execute(req: GetVersionsDTO.Request): Promise<GetVersionsDTO.Response> {
        if (!VersionType.isValid(req.type)) {
            return Result.fail(UseCaseError.create('c', 'type is not valid'));
        }

        const versionsFound = await this.versionRepo.findByType(req.type);
        if (versionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding versions'));
        }

        const versions = versionsFound.getValue()!;

        return Result.ok({versions});
    }
}
import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IVersionRepo } from "../../../repo/versions/IVersionRepo";
import { DeleteVersionDTO } from "./DeleteVersionDTO";
import { deleteVersionErrors } from "./deleteVersionErrors";

export class DeleteVersionUseCase implements IUseCase<DeleteVersionDTO.Request, DeleteVersionDTO.Response> {
    private versionRepo: IVersionRepo;

    public errors = deleteVersionErrors;

    constructor(versionRepo: IVersionRepo) {
        this.versionRepo = versionRepo;
    }

    public async execute(req: DeleteVersionDTO.Request): Promise<DeleteVersionDTO.Response> {
        if (!Types.ObjectId.isValid(req.versionId)) {
            return Result.fail(UseCaseError.create('c', 'versionId is not valid'));
        }

        const versionFound = await this.versionRepo.findById(req.versionId);
        if (versionFound.isFailure) {
            return Result.fail(versionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding version') : UseCaseError.create('b', 'Version does not exist'));
        }

        const versionDeleted = await this.versionRepo.deleteById(req.versionId);
        if (versionDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting version'));
        }

        return Result.ok({versionId: req.versionId});
    }
}
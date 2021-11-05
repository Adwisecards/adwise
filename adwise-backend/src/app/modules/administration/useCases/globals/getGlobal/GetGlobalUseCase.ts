import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobalRepo } from "../../../repo/globals/IGlobalRepo";
import { GetGlobalDTO } from "./GetGlobalDTO";
import { getGlobalErrors } from "./getGlobalErrors";

export class GetGlobalUseCase implements IUseCase<GetGlobalDTO.Request, GetGlobalDTO.Response> {
    private globalRepo: IGlobalRepo;
    public errors: UseCaseError[] = [
        ...getGlobalErrors
    ];
    constructor(globalRepo: IGlobalRepo) {
        this.globalRepo = globalRepo;
    }

    public async execute(_: GetGlobalDTO.Request): Promise<GetGlobalDTO.Response> {
        const globalFound = await this.globalRepo.getGlobal();
        if (globalFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalFound.getValue()!;

        return Result.ok({global});
    }
}
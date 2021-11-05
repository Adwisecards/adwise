import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IRefRepo } from "../../repo/IRefRepo";
import { GetRefByCodeDTO } from "./GetRefByCodeDTO";
import { getRefByCodeErrors } from "./getRefByCodeErrors";

export class GetRefByCodeUseCase implements IUseCase<GetRefByCodeDTO.Request, GetRefByCodeDTO.Response> {
    private refRepo: IRefRepo;
    public errors: UseCaseError[] = [
        ...getRefByCodeErrors
    ];
    constructor(refRepo: IRefRepo) {
        this.refRepo = refRepo;
    }

    public async execute(req: GetRefByCodeDTO.Request): Promise<GetRefByCodeDTO.Response> {
        if (req.code.length !== 8) {
            return Result.fail(UseCaseError.create('c'));
        }

        const refFound = await this.refRepo.findByCode(req.code);
        if (refFound.isFailure) {
            return Result.fail(refFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const ref = refFound.getValue()!;

        return Result.ok({ref});
    }
}
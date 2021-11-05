import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IGlobal } from "../../../../app/modules/administration/models/Global";
import { IGlobalRepo } from "../../../../app/modules/administration/repo/globals/IGlobalRepo";

interface ICreateGlobalObjects {
    global: IGlobal;
};

export class CreateGlobalTest {
    private globalRepo: IGlobalRepo;

    constructor(
        globalRepo: IGlobalRepo
    ) {
        this.globalRepo = globalRepo;
    }

    public async execute(): Promise<Result<ICreateGlobalObjects | null, UseCaseError | null>> {
        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        return Result.ok({global});
    }
}
import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IGlobalRepo } from "../../../repo/globals/IGlobalRepo";
import { GlobalRepo } from "../../../repo/globals/implementation/GlobalRepo";
import { SetOrganizationGlobalDTO } from './SetOrganizationGlobalDTO';
import { setOrganizationGlobalErrors } from './setOrganizationGlobalErrors';

export class SetOrganizationGlobalUseCase implements IUseCase<SetOrganizationGlobalDTO.Request, SetOrganizationGlobalDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private globalRepo: IGlobalRepo;

    public errors = setOrganizationGlobalErrors;

    constructor(organizationRepo: IOrganizationRepo, globalRepo: GlobalRepo) {
        this.organizationRepo = organizationRepo;
        this.globalRepo = globalRepo;
    }

    public async execute(req: SetOrganizationGlobalDTO.Request): Promise<SetOrganizationGlobalDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        global.organization = organization._id;

        const globalSaved = await this.globalRepo.save(global);
        if (globalSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving global'));
        }

        return Result.ok({organizationId: req.organizationId});
    }
}
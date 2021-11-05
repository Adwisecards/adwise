import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { SetOrganizationTipsDTO } from "./SetOrganizationTipsDTO";
import { setOrganizationTipsErrors } from "./setOrganizationTipsErrors";

export class SetOrganizationTipsUseCase implements IUseCase<SetOrganizationTipsDTO.Request, SetOrganizationTipsDTO.Response> {
    private organizationRepo: IOrganizationRepo;

    public errors = setOrganizationTipsErrors;

    constructor(organizationRepo: IOrganizationRepo) {
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: SetOrganizationTipsDTO.Request): Promise<SetOrganizationTipsDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', "organizationId is not valid"));
        }

        if (typeof req.tips != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'tips is not valid'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
           return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }
        
        const organization = organizationFound.getValue()!;

        organization.tips = req.tips;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({organizationId: organization._id});
    }
}
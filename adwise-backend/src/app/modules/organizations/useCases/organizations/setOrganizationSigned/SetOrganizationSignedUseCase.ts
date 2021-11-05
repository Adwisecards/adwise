import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { SetOrganizationSignedDTO } from "./SetOrganizationSignedDTO";
import { setOrganizationSignedErrors } from "./setOrganizationSignedErrors";

export class SetOrganizationSignedUseCase implements IUseCase<SetOrganizationSignedDTO.Request, SetOrganizationSignedDTO.Response> {
    private organizationRepo: IOrganizationRepo;

    public errors = setOrganizationSignedErrors;

    constructor(organizationRepo: IOrganizationRepo) {
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: SetOrganizationSignedDTO.Request): Promise<SetOrganizationSignedDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        if (typeof req.signed != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'signed is not valid'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        organization.signed = req.signed;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({organizationId: req.organizationId});
    }
}
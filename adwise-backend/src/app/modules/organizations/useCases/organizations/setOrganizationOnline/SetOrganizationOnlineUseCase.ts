import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { SetOrganizationOnlineDTO } from "./SetOrganizationOnlineDTO";
import { setOrganizationOnlineErrors } from "./setOrganizationOnlineErrors";

export class SetOrganizationOnlineUseCase implements IUseCase<SetOrganizationOnlineDTO.Request, SetOrganizationOnlineDTO.Response> {
    private organizationRepo: IOrganizationRepo;

    public errors = setOrganizationOnlineErrors;

    constructor(organizationRepo: IOrganizationRepo) {
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: SetOrganizationOnlineDTO.Request): Promise<SetOrganizationOnlineDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        if (typeof req.online != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'online must be boolean'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        organization.online = req.online;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({organizationId: req.organizationId});
    }
} 
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { SetOrganizationCashDTO } from "./SetOrganizationCashDTO";
import { setOrganizationCashErrors } from "./setOrganizationCashErrors";

export class SetOrganizationCashUseCase implements IUseCase<SetOrganizationCashDTO.Request, SetOrganizationCashDTO.Response> {
    private organizationRepo: IOrganizationRepo;

    public errors = setOrganizationCashErrors;

    constructor(organizationRepo: IOrganizationRepo) {
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: SetOrganizationCashDTO.Request): Promise<SetOrganizationCashDTO.Response> {
        if (typeof req.cash != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'cash is not valid'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding organization") : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        organization.cash = req.cash;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({organizationId: organization._id.toString()});
    }
}
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { SetAddressCoordsDTO } from "./SetAddressCoordsDTO";
import { setAddressCoordsErrors } from "./setAddressCoordsErrors";

export class SetAddressCoordsUseCase implements IUseCase<SetAddressCoordsDTO.Request, SetAddressCoordsDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;

    public errors = setAddressCoordsErrors;

    constructor(
        organizationRepo: IOrganizationRepo,
        organizationValidationService: IOrganizationValidationService
    ) {
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
    }

    public async execute(req: SetAddressCoordsDTO.Request): Promise<SetAddressCoordsDTO.Response> {
        const valid = this.organizationValidationService.setAddressCoordsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        console.log(organization.user, req.userId);

        if (organization.user.toString() != req.userId) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        organization.address.coords = req.coords;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({organizationId: req.organizationId});
    }
}
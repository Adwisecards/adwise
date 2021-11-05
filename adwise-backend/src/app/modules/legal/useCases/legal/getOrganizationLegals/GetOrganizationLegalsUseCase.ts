import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ILegal } from "../../../models/Legal";
import { ILegalRepo } from "../../../repo/legal/ILegalRepo";
import { ILegalValidationService } from "../../../services/legal/legalValidationService/ILegalValidationService";
import { GetOrganizationLegalDTO } from "../getOrganizationLegal/GetOrganizationLegalDTO";
import { GetOrganizationLegalsDTO } from "./GetOrganizationLegalsDTO";
import { getOrganizationLegalsErrors } from "./getOrganizationLegalsErrors";

interface IKeyObjects {
    user: IUser;
    organization: IOrganization;
    legals: ILegal[];
};

export class GetOrganizationLegalsUseCase implements IUseCase<GetOrganizationLegalsDTO.Request, GetOrganizationLegalsDTO.Response> {
    private userRepo: IUserRepo;
    private legalRepo: ILegalRepo;
    private organizationRepo: IOrganizationRepo;
    private legalValidationService: ILegalValidationService;

    public errors = getOrganizationLegalsErrors;

    constructor(
        userRepo: IUserRepo,
        legalRepo: ILegalRepo,
        organizationRepo: IOrganizationRepo,
        legalValidationService: ILegalValidationService
    ) {
        this.userRepo = userRepo;
        this.legalRepo = legalRepo;
        this.organizationRepo = organizationRepo;
        this.legalValidationService = legalValidationService;
    }

    public async execute(req: GetOrganizationLegalsDTO.Request): Promise<GetOrganizationLegalsDTO.Response> {
        const valid = this.legalValidationService.getOrganizationLegalsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.organizationId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            legals,
            organization,
            user
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        return Result.ok({legals});
    }

    private async getKeyObjects(userId: string, organizationId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const legalsFound = await this.legalRepo.findManyByOrganization(organization._id.toString());
        if (legalsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding legals'));
        }

        const legals = legalsFound.getValue()!;

        return Result.ok({
            user,
            legals,
            organization
        });
    }
}
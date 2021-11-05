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
import { UpdateLegalInfoDTO } from "./UpdateLegalInfoDTO";
import { updateLegalInfoErrors } from "./updateLegalInfoErrors";

interface IKeyObjects {
    user: IUser;
    legal: ILegal;
    organization: IOrganization;
};

export class UpdateLegalInfoUseCase implements IUseCase<UpdateLegalInfoDTO.Request, UpdateLegalInfoDTO.Response> {
    private userRepo: IUserRepo;
    private legalRepo: ILegalRepo;
    private organizationRepo: IOrganizationRepo;
    private legalValidationService: ILegalValidationService;

    public errors = updateLegalInfoErrors;

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

    public async execute(req: UpdateLegalInfoDTO.Request): Promise<UpdateLegalInfoDTO.Response> {
        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.organizationId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            legal,
            organization,
            user
        } = keyObjectsGotten.getValue()!;

        const valid = this.validateRequest(req, legal);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        if (organization.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        legal.info = {
            ...legal.info,
            ...req.info
        };

        const legalSaved = await this.legalRepo.save(legal);
        if (legalSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving legal'));
        }

        return Result.ok({
            legalId: legal._id.toString()
        });
    }

    private validateRequest(req: UpdateLegalInfoDTO.Request, legal: ILegal): Result<string | null, string | null> {
        switch (legal.form) {
            case 'individual':
                return this.legalValidationService.updateIndividualLegalInfo(req);
            case 'ip':
                return this.legalValidationService.updateIpLegalInfo(req);
            case 'ooo':
                return this.legalValidationService.updateOOOLegalInfo(req);
            default:
                return Result.fail('Invalid value for "form" path');
        }
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

        const legalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (legalFound.isFailure) {
            return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal') : UseCaseError.create('b4'));
        }

        const legal = legalFound.getValue()!;

        return Result.ok({
            legal,
            organization,
            user
        });
    }
}
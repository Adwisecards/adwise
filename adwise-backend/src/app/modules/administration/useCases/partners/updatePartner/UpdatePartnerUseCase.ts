import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPartnerRepo } from "../../../repo/partners/IPartnerRepo";
import { IPartnerValidationService } from "../../../services/partnerValidationService/IPartnerValidationService";
import { UpdatePartnerDTO } from "./UpdatePartnerDTO";
import { updatePartnerErrors } from "./updatePartnerErrors";

export class UpdatePartnerUseCase implements IUseCase<UpdatePartnerDTO.Request, UpdatePartnerDTO.Response> {
    private partnerRepo: IPartnerRepo;
    private partnerValidationService: IPartnerValidationService;

    public errors = updatePartnerErrors;

    constructor(
        partnerRepo: IPartnerRepo,
        partnerValidationService: IPartnerValidationService
    ) {
        this.partnerRepo = partnerRepo;
        this.partnerValidationService = partnerValidationService;
    }

    public async execute(req: UpdatePartnerDTO.Request): Promise<UpdatePartnerDTO.Response> {
        const valid = this.partnerValidationService.updatePartnerData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const partnerFound = await this.partnerRepo.findById(req.partnerId);
        if (partnerFound.isFailure) {
            return Result.fail(partnerFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding partner') : UseCaseError.create('a7'));
        }

        const partner = partnerFound.getValue()!;

        for (const key in req) {
            if ((<any>req)[key] != undefined) {
                if (key == 'pictureMediaId') {
                    partner.picture = (<any>req)[key];
                }

                (<any>partner)[key] = (<any>req)[key];
            }
        }

        const partnerSaved = await this.partnerRepo.save(partner);
        if (partnerSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding partner'));
        }

        return Result.ok({
            partnerId: partner._id.toString()
        });
    }
}
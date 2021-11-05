import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPartnerRepo } from "../../../repo/partners/IPartnerRepo";
import { IPartnerValidationService } from "../../../services/partnerValidationService/IPartnerValidationService";
import { DeletePartnerDTO } from "./DeletePartnerDTO";
import { deletePartnerErrors } from "./deletePartnerErrors";

export class DeletePartnerUseCase implements IUseCase<DeletePartnerDTO.Request, DeletePartnerDTO.Response> {
    private partnerRepo: IPartnerRepo;
    private partnerValidationService: IPartnerValidationService;

    public errors = deletePartnerErrors;

    constructor(
        partnerRepo: IPartnerRepo,
        partnerValidationService: IPartnerValidationService 
    ) {
        this.partnerRepo = partnerRepo;
        this.partnerValidationService = partnerValidationService;
    }

    public async execute(req: DeletePartnerDTO.Request): Promise<DeletePartnerDTO.Response> {
        const valid = this.partnerValidationService.deletePartnerData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const partnerFound = await this.partnerRepo.findById(req.partnerId);
        if (partnerFound.isFailure) {
            return Result.fail(partnerFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding partner') : UseCaseError.create('a7'));
        }

        const partner = partnerFound.getValue()!;

        const partnerDeleted = await this.partnerRepo.deleteById(partner._id.toString());
        if (partnerDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting partner'));
        }

        return Result.ok({partnerId: partner._id.toString()});
    }
}
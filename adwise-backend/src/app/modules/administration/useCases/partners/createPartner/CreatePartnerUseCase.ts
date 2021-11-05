import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { PartnerModel } from "../../../models/Partner";
import { IPartnerRepo } from "../../../repo/partners/IPartnerRepo";
import { IPartnerValidationService } from "../../../services/partnerValidationService/IPartnerValidationService";
import { CreatePartnerDTO } from "./CreatePartnerDTO";
import { createPartnerErrors } from "./createPartnerErrors";

export class CreatePartnerUseCase implements IUseCase<CreatePartnerDTO.Request, CreatePartnerDTO.Response> {
    private partnerRepo: IPartnerRepo;
    private partnerValidationService: IPartnerValidationService;

    public errors = createPartnerErrors;

    constructor(
        partnerRepo: IPartnerRepo,
        partnerValidationService: IPartnerValidationService
    ) {
        this.partnerRepo = partnerRepo;
        this.partnerValidationService = partnerValidationService;
    }

    public async execute(req: CreatePartnerDTO.Request): Promise<CreatePartnerDTO.Response> {
        const valid = this.partnerValidationService.createPartnerData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const partner = new PartnerModel({
            index: req.index,
            name: req.name,
            description: req.description,
            picture: req.pictureMediaId,
            presentationUrl: req.presentationUrl
        });

        const partnerSaved = await this.partnerRepo.save(partner);
        if (partnerSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving partner'));
        }

        return Result.ok({
            partnerId: partner._id.toString()
        });
    }
}
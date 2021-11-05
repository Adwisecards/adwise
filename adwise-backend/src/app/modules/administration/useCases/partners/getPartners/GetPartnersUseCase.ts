import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPartnerRepo } from "../../../repo/partners/IPartnerRepo";
import { GetPartnersDTO } from "./GetPartnersDTO";
import { getPartnersErrors } from "./getPartnersErrors";

export class GetPartnersUseCase implements IUseCase<GetPartnersDTO.Request, GetPartnersDTO.Response> {
    private partnerRepo: IPartnerRepo;

    public errors = getPartnersErrors;

    constructor(partnerRepo: IPartnerRepo) {
        this.partnerRepo = partnerRepo;
    }

    public async execute(_: GetPartnersDTO.Request): Promise<GetPartnersDTO.Response> {
        const partnersGotten = await this.partnerRepo.getAll();
        if (partnersGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', "Error upon getting partners"));
        }

        const partners = partnersGotten.getValue()!.sort((a, b) => a.index > b.index ? 1 : -1);

        return Result.ok({
            partners
        });
    }
}
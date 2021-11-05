import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOfferRepo } from "../../../repo/offers/IOfferRepo";
import { GetOfferDTO } from "./GetOfferDTO";
import { getOfferErrors } from "./getOfferErrors";

export class GetOfferUseCase implements IUseCase<GetOfferDTO.Request, GetOfferDTO.Response> {
    private offerRepo: IOfferRepo;
    
    public errors = getOfferErrors;

    constructor(offerRepo: IOfferRepo) {
        this.offerRepo = offerRepo;
    }

    public async execute(req: GetOfferDTO.Request): Promise<GetOfferDTO.Response> {
        if (!Types.ObjectId.isValid(req.offerId)) {
            return Result.fail(UseCaseError.create('c', 'offerId is not valid'));
        }

        const offerFound = await this.offerRepo.findById(req.offerId);
        if (offerFound.isFailure) {
            return Result.fail(offerFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding offer') : UseCaseError.create('p'));
        }

        const offer = offerFound.getValue()!;

        return Result.ok({offer});
    }
}

import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IMapsService, MapsServiceLanguage } from "../../../../services/mapsService/IMapsService";
import { GetAddressDetailsDTO } from "./GetAddressDetailsDTO";
import { getAddressDetailsErrors } from "./getAddressDetailsErrors";

export class GetAddressDetailsUseCase implements IUseCase<GetAddressDetailsDTO.Request, GetAddressDetailsDTO.Response> {
    private mapsService: IMapsService;
    public errors = [
        ...getAddressDetailsErrors
    ];

    constructor(mapsService: IMapsService) {
        this.mapsService = mapsService;
    }

    public async execute(req: GetAddressDetailsDTO.Request): Promise<GetAddressDetailsDTO.Response> {
        const addressDetailsGotten = await this.mapsService.getAddressDetailsByPlaceId(req.placeId, req.language as MapsServiceLanguage);
        if (addressDetailsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting address details'));
        }

        const addressDetails = addressDetailsGotten.getValue()!;
        return Result.ok({addressDetails});
    }
}
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IMapsService, MapsServiceLanguage } from "../../../../services/mapsService/IMapsService";
import { GetAddressFromCoordsDTO } from "./GetAddressFromCoordsDTO";
import { getAddressFromCoordsErrors } from "./getAddressFromCoordsErrors";

export class GetAddressFromCoordsUseCase implements IUseCase<GetAddressFromCoordsDTO.Request, GetAddressFromCoordsDTO.Response> {
    private mapsService: IMapsService;
    public errors: UseCaseError[] = [
        ...getAddressFromCoordsErrors
    ];
    constructor(mapsService: IMapsService) {
        this.mapsService = mapsService;
    }

    public async execute(req: GetAddressFromCoordsDTO.Request): Promise<GetAddressFromCoordsDTO.Response> {
        const addressDecoded = await this.mapsService.getAddressFromCoords(req.lat, req.long, req.language as MapsServiceLanguage);
        if (addressDecoded.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon decoding address'));
        }

        const address = addressDecoded.getValue()!;
        return Result.ok({address: address});
    }
}
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IMapsService, MapsServiceLanguage } from "../../../../services/mapsService/IMapsService";
import { GetAddressSuggestionsDTO } from "./GetAddressSuggestionsDTO";
import { getAddressSuggestionsErrors } from "./getAddressSuggestionsErrors";

export class GetAddressSuggestionsUseCase implements IUseCase<GetAddressSuggestionsDTO.Request, GetAddressSuggestionsDTO.Response> {
    private mapsService: IMapsService;
    public errors: UseCaseError[] = [
        ...getAddressSuggestionsErrors
    ];

    constructor(mapsService: IMapsService) {
        this.mapsService = mapsService;
    }

    public async execute(req: GetAddressSuggestionsDTO.Request): Promise<GetAddressSuggestionsDTO.Response> {
        if (!req.input) {
            return Result.fail(UseCaseError.create('c'));
        }

        const addressSuggestionsFound = await this.mapsService.getAddressSuggestions(req.input, req.language as MapsServiceLanguage);
        if (addressSuggestionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting address suggestions'));
        }

        const addressSuggestions = addressSuggestionsFound.getValue()!;
        return Result.ok({addressSuggestions});
    }
}
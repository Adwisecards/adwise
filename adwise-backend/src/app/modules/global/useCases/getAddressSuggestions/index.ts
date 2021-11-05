import { mapsService } from "../../../../services/mapsService";
import { GetAddressSuggestionsController } from "./GetAddressSuggestionsController";
import { GetAddressSuggestionsUseCase } from "./GetAddressSuggestionsUseCase";

const getAddressSuggestionsUseCase = new GetAddressSuggestionsUseCase(mapsService);
const getAddressSuggestionsController = new GetAddressSuggestionsController(getAddressSuggestionsUseCase);

export {
    getAddressSuggestionsUseCase,
    getAddressSuggestionsController
};
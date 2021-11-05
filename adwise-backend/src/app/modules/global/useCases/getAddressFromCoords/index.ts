import { mapsService } from "../../../../services/mapsService";
import { GetAddressFromCoordsController } from "./GetAddressFromCoordsController";
import { GetAddressFromCoordsUseCase } from "./GetAddressFromCoordsUseCase";

const getAddressFromCoordsUseCase = new GetAddressFromCoordsUseCase(mapsService);
const getAddressFromCoordsController = new GetAddressFromCoordsController(getAddressFromCoordsUseCase);

export {
    getAddressFromCoordsUseCase,
    getAddressFromCoordsController
};
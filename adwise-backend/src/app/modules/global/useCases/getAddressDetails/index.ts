import { mapsService } from "../../../../services/mapsService";
import { GetAddressDetailsController } from "./GetAddressDetailsController";
import { GetAddressDetailsUseCase } from "./GetAddressDetailsUseCase";

const getAddressDetailsUseCase = new GetAddressDetailsUseCase(mapsService);
const getAddressDetailsController = new GetAddressDetailsController(getAddressDetailsUseCase);

export {
    getAddressDetailsUseCase,
    getAddressDetailsController
};
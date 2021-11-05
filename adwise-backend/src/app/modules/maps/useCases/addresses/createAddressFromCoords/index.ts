import { mapsService } from "../../../../../services/mapsService";
import { addressRepo } from "../../../repo/addresses";
import { addressValidationService } from "../../../services/addresses/addressValidationService";
import { CreateAddressFromCoordsController } from "./CreateAddressFromCoordsController";
import { CreateAddressFromCoordsUseCase } from "./CreateAddressFromCoordsUseCase";

export const createAddressFromCoordsUseCase = new CreateAddressFromCoordsUseCase(
    mapsService,
    addressRepo,
    addressValidationService
);

export const createAddressFromCoordsController = new CreateAddressFromCoordsController(createAddressFromCoordsUseCase);
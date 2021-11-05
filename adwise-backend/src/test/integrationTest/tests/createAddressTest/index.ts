import { createAddressFromCoordsUseCase } from "../../../../app/modules/maps/useCases/addresses/createAddressFromCoords";
import { CreateAddressTest } from "./CreateAddressTest";

export const createAddressTest = new CreateAddressTest(
    createAddressFromCoordsUseCase
);
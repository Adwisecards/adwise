import { Router } from "express";
import { applyAdmin, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createAddressFromCoordsController } from "../../../useCases/addresses/createAddressFromCoords";

export const addressRouter = Router();

addressRouter.post('/create-address-from-coords', applyBlock, applyAuth, (req, res) => createAddressFromCoordsController.execute(req, res));

/*
[
    {
        "name": "Create address from coords",
        "path": "/maps/create-address-from-coords",
        "dto": "src/app/modules/media/useCases/createAddressFromCoords/CreateAddressFromCoordsDTO.ts",
        "errors": "src/app/modules/media/useCases/createAddressFromCoords/createAddressFromCoordsErrors.ts",
        "method": "POST",
        "description": "Создаёт адрес."
    }
]
*/
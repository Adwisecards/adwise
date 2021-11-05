import { Router } from "express";
import { applyBlock } from "../../../../services/server/implementation/middleware/middlewares";
import { getAddressDetailsController } from "../../useCases/getAddressDetails";
import { getAddressFromCoordsController } from "../../useCases/getAddressFromCoords";
import { getAddressSuggestionsController } from "../../useCases/getAddressSuggestions";
import { getContactPassController } from "../../useCases/getContactPass";
import { getCountryLegalFormsController } from "../../useCases/getCountryLegalForms";
import { getFileController } from "../../useCases/getFile";
import { getPurchasePassController } from "../../useCases/getPurchasePass";
import { requestCallController } from "../../useCases/requestCall";

const globalRouter = Router();

const mediaRouter = Router();

mediaRouter.get('/get-file/:filename', applyBlock, (req, res) => getFileController.execute(req, res));

const mapsRouter = Router();

mapsRouter.get('/get-address-from-coords', applyBlock, (req, res) => getAddressFromCoordsController.execute(req, res));
mapsRouter.get('/get-address-suggestions', applyBlock, (req, res) => getAddressSuggestionsController.execute(req, res));
mapsRouter.get('/get-address-details/:id', applyBlock, (req, res) => getAddressDetailsController.execute(req, res));

const staticRouter = Router();

staticRouter.get('/get-country-legal-forms', applyBlock, (req, res) => getCountryLegalFormsController.execute(req, res));

const emailRouter = Router();

emailRouter.post('/request-call', applyBlock, (req, res) => requestCallController.execute(req, res));

const walletRouter = Router();

walletRouter.get('/contact-pass/:id', (req, res) => getContactPassController.execute(req, res));
walletRouter.get('/purchase-pass/:id', (req, res) => getPurchasePassController.execute(req, res));

globalRouter.use('/maps', applyBlock, mapsRouter);
globalRouter.use('/static', applyBlock, staticRouter);
globalRouter.use('/email', applyBlock, emailRouter);
globalRouter.use('/wallet', applyBlock, walletRouter);
globalRouter.use('/media', mediaRouter);

export {
    globalRouter
};

/*
[
    {   
        "name": "get file",
        "path": "/global/media/get-file/:filename",
        "dto": "src/app/modules/global/useCases/getFile/GetFileDTO.ts",
        "errors": "src/app/modules/global/useCases/getFile/getFileErrors.ts",
        "method": "GET",
        "description": "возвращает файл."
    },
    {   
        "name": "get address from coordinates",
        "path": "/global/maps/get-address-from-coords?lat={lat}&long={long}",
        "dto": "src/app/modules/global/useCases/getAddressFromCoords/GetAddressFromCoordsDTO.ts",
        "errors": "src/app/modules/global/useCases/getAddressFromCoords/getAddressFromCoordsErrors.ts",
        "method": "GET",
        "description": "возвращает адрес, по координатам."
    },
    {   
        "name": "get address suggestions",
        "path": "/global/maps/get-address-suggestions?search={search}",
        "dto": "src/app/modules/global/useCases/getAddressSuggestions/GetAddressSuggestionsDTO.ts",
        "errors": "src/app/modules/global/useCases/getAddressSuggestions/getAddressSuggestionsErrors.ts",
        "method": "GET",
        "description": "Возвращает массив адресов, найденных по запросу."
    },
    {   
        "name": "get address details",
        "path": "/global/maps/get-address-details/:{id}",
        "dto": "src/app/modules/global/useCases/getAddressDetails/GetAddressDetailsDTO.ts",
        "errors": "src/app/modules/global/useCases/getAddressDetails/getAddressDetailsErrors.ts",
        "method": "GET",
        "description": "Возвращает детали адреса по айди."
    },
    {   
        "name": "get country legal forms",
        "path": "/global/static/get-country-legal-forms?country={country}",
        "dto": "src/app/modules/global/useCases/getCountryLegalForms/GetCountryLegalFormsDTO.ts",
        "errors": "src/app/modules/global/useCases/getCountryLegalForms/getCountryLegalFormsErrors.ts",
        "method": "GET",
        "description": "Возвращает массив правовых форм организаций."
    },
    {   
        "name": "Request call",
        "path": "/global/email/request-call",
        "dto": "src/app/modules/global/useCases/requestCall/RequestCallDTO.ts",
        "errors": "src/app/modules/global/useCases/requestCall/requestCallErrors.ts",
        "method": "POST",
        "description": "Отправляет запрос об обратном звонке."
    }
]
*/
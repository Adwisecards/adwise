import { Router } from "express";
import { applyBlock } from "../../../../services/server/implementation/middleware/middlewares";
import { createMediaController } from "../../useCases/createMedia";
import { getMediaController } from "../../useCases/getMedia";
import { getMediaDataController } from "../../useCases/getMediaData";

export const mediaRouter = Router();

mediaRouter.post('/create-media', applyBlock, (req, res) => createMediaController.execute(req, res));
mediaRouter.get('/get-media-data/:id', applyBlock, (req, res) => getMediaDataController.execute(req, res));
mediaRouter.get('/get-media/:id', applyBlock, (req, res) => getMediaController.execute(req, res));

/*
[
    {
        "name": "Create media",
        "path": "/media/create-media",
        "dto": "src/app/modules/media/useCases/createMedia/CreateMediaDTO.ts",
        "errors": "src/app/modules/media/useCases/createMedia/createMediaErrors.ts",
        "method": "POST",
        "description": "Создаёт медиа документ."
    },
    {
        "name": "Get media data",
        "path": "/media/get-media-data/{id}",
        "dto": "src/app/modules/media/useCases/getMediaData/GetMediaDataDTO.ts",
        "errors": "src/app/modules/media/useCases/getMediaData/getMediaDataErrors.ts",
        "method": "GET",
        "description": "Получить файл медиа документа."
    },
    {
        "name": "Get media",
        "path": "/media/get-media/{id}",
        "dto": "src/app/modules/media/useCases/getMedia/GetMediaDTO.ts",
        "errors": "src/app/modules/media/useCases/getMedia/getMediaErrors.ts",
        "method": "GET",
        "description": "Получить данные медиа документа."
    }
]
*/
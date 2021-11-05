import { Router } from "express";
import { applyBlock } from "../../../../services/server/implementation/middleware/middlewares";
import { getRefByCodeController } from "../../useCases/getRefByCode";

const refRouter = Router();

refRouter.get('/get-ref/:code', applyBlock, (req, res) => getRefByCodeController.execute(req, res));

export {
    refRouter
};

/*
[
    {   
        "name": "get reference",
        "path": "/refs/get-ref/{code}",
        "dto": "src/app/modules/ref/useCases/getRefByCode/GetRefByCodeDTO.ts",
        "errors": "src/app/modules/ref/useCases/getRefByCode/getRefByCodeErrors.ts",
        "method": "GET",
        "description": "Метод находит объект, который содержит ссылку на кьюар код, код строкой и данные, нужные для того, чтобы поделиться."
    }
]
*/
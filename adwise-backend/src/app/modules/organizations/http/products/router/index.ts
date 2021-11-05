import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createProductController } from "../../../useCases/products/createProduct";
import { disableProductController } from "../../../useCases/products/disableProduct";
import { getProductController } from "../../../useCases/products/getProduct";

const productRouter = Router();

productRouter.post('/create-product', applyBlock, applyAuth, (req, res) => createProductController.execute(req, res));
productRouter.get('/get-product/:id', applyBlock, applyAuth, (req, res) => getProductController.execute(req, res));
productRouter.put('/set-product-disabled/:id', applyBlock, applyAuth, (req, res) => disableProductController.execute(req, res));

export {
    productRouter
};

/*
[
    {   
        "name": "create product",
        "path": "/organizations/create-product",
        "dto": "src/app/modules/organizations/useCases/products/createProduct/CreateProductDTO.ts",
        "errors": "src/app/modules/organizations/useCases/products/createProduct/createProductErrors.ts",
        "method": "POST",
        "description": "Создаёт продукт и добавляет его к организации."
    },
    {   
        "name": "get product",
        "path": "/organizations/get-product/{id}",
        "dto": "src/app/modules/organizations/useCases/products/getProduct/GetProductDTO.ts",
        "errors": "src/app/modules/organizations/useCases/products/getProduct/getProductErrors.ts",
        "method": "POST",
        "description": "Возвращает продукт с айди."
    },
    {   
        "name": "set product disabled",
        "path": "/organizations/set-product-disabled/{id}",
        "dto": "src/app/modules/organizations/useCases/products/disableProduct/DisableProductDTO.ts",
        "errors": "src/app/modules/organizations/useCases/products/disableProduct/disableProductErrors.ts",
        "method": "PUT",
        "description": "Возвращает продукт с айди."
    }
]
*/
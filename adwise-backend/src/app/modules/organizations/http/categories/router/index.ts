import { Router } from "express";
import { applyAdmin, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createCategoryController } from "../../../useCases/categories/createCategory";
import { deleteCategoryController } from "../../../useCases/categories/deleteCategory";
import { getCategoriesController } from "../../../useCases/categories/getCategories";

const categoryRouter = Router();

categoryRouter.post('/create-category', applyBlock, applyAdmin, (req, res) => createCategoryController.execute(req, res));
categoryRouter.delete('/delete-category/:id', applyBlock, applyAdmin, (req, res) => deleteCategoryController.execute(req, res));
categoryRouter.get('/get-categories', (req, res) => getCategoriesController.execute(req, res));

export {
    categoryRouter
};

/*
[
    {   
        "name": "create category",
        "path": "/organizations/create-category",
        "dto": "src/app/modules/organizations/useCases/categories/createCategory/CreateCategoryDTO.ts",
        "errors": "src/app/modules/organizations/useCases/categories/createCategory/createCategoryErrors.ts",
        "method": "POST",
        "description": "Создаёт категорию."
    },
    {   
        "name": "delete category",
        "path": "/organizations/delete-category/{id}",
        "dto": "src/app/modules/organizations/useCases/categories/deleteCategory/DeleteCategoryDTO.ts",
        "errors": "src/app/modules/organizations/useCases/categories/deleteCategory/deleteCategoryErrors.ts",
        "method": "DELETE",
        "description": "Удаляет категорию."
    },
    {   
        "name": "get categories",
        "path": "/organizations/get-categories",
        "dto": "src/app/modules/organizations/useCases/categories/getCategories/GetCategoriesDTO.ts",
        "errors": "src/app/modules/organizations/useCases/categories/getCategories/getCategoriesErrors.ts",
        "method": "GET",
        "description": "Возвращает все категории.",
        "tags": ["administration"]
    }
]
*/
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { CategoryModel } from "../../../models/Category";
import { ICategoryRepo } from "../../../repo/categories/ICategoryRepo";
import { CreateCategoryDTO } from "./CreateCategoryDTO";
import { createCategoryErrors } from "./createCategoryErrors";

export class CreateCategoryUseCase implements IUseCase<CreateCategoryDTO.Request, CreateCategoryDTO.Response> {
    public errors = [
        ...createCategoryErrors
    ];
    private categoryRepo: ICategoryRepo;
    constructor(categoryRepo: ICategoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    public async execute(req: CreateCategoryDTO.Request): Promise<CreateCategoryDTO.Response> {
        if (!req.name || req.name.length < 1) {
            return Result.fail(UseCaseError.create('c', 'name is a required path'));
        }

        const categoryFound = await this.categoryRepo.findByName(req.name);
        if (categoryFound.isFailure && categoryFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding category'));
        } else if (categoryFound.isSuccess) {
            return Result.fail(UseCaseError.create('f'));
        }

        const category = new CategoryModel({
            name: req.name
        });

        const categorySaved = await this.categoryRepo.save(category);
        if (categorySaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving category'));
        }

        return Result.ok({categoryId: category._id});
    }
}
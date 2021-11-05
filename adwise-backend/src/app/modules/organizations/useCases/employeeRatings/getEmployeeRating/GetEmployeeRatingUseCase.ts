import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployeeRatingRepo } from "../../../repo/employeeRatings/IEmployeeRatingRepo";
import { IEmployeeRatingValidationService } from "../../../services/employeeRatings/employeeRatingValidationService/IEmployeeRatingValidationService";
import { GetEmployeeRatingDTO } from "./GetEmployeeRatingDTO";
import { getEmployeeRatingErrors } from "./getEmployeeRatingErrors";

export class GetEmployeeRatingUseCase implements IUseCase<GetEmployeeRatingDTO.Request, GetEmployeeRatingDTO.Response> {
    private employeeRatingRepo: IEmployeeRatingRepo;
    private employeeRatingValidationService: IEmployeeRatingValidationService;

    public errors = getEmployeeRatingErrors;

    constructor(
        employeeRatingRepo: IEmployeeRatingRepo,
        employeeRatingValidationService: IEmployeeRatingValidationService
    ) {
        this.employeeRatingRepo = employeeRatingRepo;
        this.employeeRatingValidationService = employeeRatingValidationService;
    }

    public async execute(req: GetEmployeeRatingDTO.Request): Promise<GetEmployeeRatingDTO.Response> {
        const valid = this.employeeRatingValidationService.getEmployeeRatingData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const employeeRatingFound = await this.employeeRatingRepo.findById(req.employeeRatingId);
        if (employeeRatingFound.isFailure) {
            return Result.fail(employeeRatingFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding employee rating') : UseCaseError.create('a8'));
        }

        const employeeRating = employeeRatingFound.getValue()!;

        return Result.ok({
            employeeRating
        });
    }
}
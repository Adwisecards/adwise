import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmployeeRatingRepo } from "../../../repo/employeeRatings/IEmployeeRatingRepo";
import { IEmployeeRatingValidationService } from "../../../services/employeeRatings/employeeRatingValidationService/IEmployeeRatingValidationService";
import { GetEmployeeRatingsDTO } from "./GetEmployeeRatingsDTO";
import { getEmployeeRatingsErrors } from "./getEmployeeRatingsErrors";

export class GetEmployeeRatingsUseCase implements IUseCase<GetEmployeeRatingsDTO.Request, GetEmployeeRatingsDTO.Response> {
    private employeeRatingRepo: IEmployeeRatingRepo;
    private employeeRatingValidationService: IEmployeeRatingValidationService;

    public errors = getEmployeeRatingsErrors;

    constructor(
        employeeRatingRepo: IEmployeeRatingRepo,
        employeeRatingValidationService: IEmployeeRatingValidationService
    ) {
        this.employeeRatingRepo = employeeRatingRepo;
        this.employeeRatingValidationService = employeeRatingValidationService;
    }

    public async execute(req: GetEmployeeRatingsDTO.Request): Promise<GetEmployeeRatingsDTO.Response> {
        const valid = this.employeeRatingValidationService.getEmployeeRatingsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const employeeRatingsFound = await this.employeeRatingRepo.findManyByEmployee(req.employeeId, req.limit, req.page, 'user purchaserContact employeeContact');
        if (employeeRatingsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding employee ratings'));
        }

        const employeeRatings = employeeRatingsFound.getValue()!;

        const employeeRatingsCounted = await this.employeeRatingRepo.count(['employee'], [req.employeeId]);
        if (employeeRatingsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting employee ratings'));
        }

        const count = employeeRatingsCounted.getValue()!;

        return Result.ok({employeeRatings, count});
    }
}
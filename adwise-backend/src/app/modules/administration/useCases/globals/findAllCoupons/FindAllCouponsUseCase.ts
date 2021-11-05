import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllCouponsDTO } from "./FindAllCouponsDTO";
import { findAllCouponsErrors } from "./findAllCouponsErrors";

export class FindAllCouponsUseCase implements IUseCase<FindAllCouponsDTO.Request, FindAllCouponsDTO.Response> {
    private couponRepo: ICouponRepo;
    private administrationValidationService: IAdministrationValidationService;
    public errors = [
        ...findAllCouponsErrors
    ];

    constructor(couponRepo: ICouponRepo, administrationValidationService: IAdministrationValidationService) {
        this.couponRepo = couponRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllCouponsDTO.Request): Promise<FindAllCouponsDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber') continue;

            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        const couponsFound = await this.couponRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'offer');
        if (couponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
        }

        const coupons = couponsFound.getValue()!;

        const countFound = await this.couponRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;
        
        return Result.ok({coupons, count});
    }
}
import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IEmployeeRepo } from "../../../repo/employees/IEmployeeRepo";
import { IFavoriteOrganizationListRepo } from "../../../repo/favoriteOrganizationLists/IFavoriteOrganizationListRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { RemoveOrganizationFromUserFavoriteListUseCase } from "../../favoriteOrganizationLists/removeOrganizationFromUserFavoriteList/RemoveOrganizationFromUserFavoriteListUseCase";
import { SetOrganizationDisabledDTO } from "./SetOrganizationDisabledDTO";
import { setOrganizationDisabledErrors } from "./setOrganizationDisabledErrors";

export class SetOrganizationDisabledUseCase implements IUseCase<SetOrganizationDisabledDTO.Request, SetOrganizationDisabledDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private couponRepo: ICouponRepo;
    private employeeRepo: IEmployeeRepo;
    private favoriteOrganizationListRepo: IFavoriteOrganizationListRepo;
    private removeOrganizationFromUserFavoriteList: RemoveOrganizationFromUserFavoriteListUseCase;
    private purchaseRepo: IPurchaseRepo;

    public errors = [
        ...setOrganizationDisabledErrors
    ];

    constructor(
        organizationRepo: IOrganizationRepo, 
        couponRepo: ICouponRepo, 
        employeeRepo: IEmployeeRepo,
        favoriteOrganizationListRepo: IFavoriteOrganizationListRepo,
        removeOrganizationFromUserFavoriteList: RemoveOrganizationFromUserFavoriteListUseCase,
        purchaseRepo: IPurchaseRepo
    ) {
        this.organizationRepo = organizationRepo;
        this.couponRepo = couponRepo;
        this.employeeRepo = employeeRepo;
        this.favoriteOrganizationListRepo = favoriteOrganizationListRepo;
        this.removeOrganizationFromUserFavoriteList = removeOrganizationFromUserFavoriteList;
        this.purchaseRepo = purchaseRepo;
    }

    public async execute(req: SetOrganizationDisabledDTO.Request): Promise<SetOrganizationDisabledDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        if (typeof req.disabled != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'disabled is not valid'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('b', 'Organization does not exist'));
        }

        const organization = organizationFound.getValue()!;
        organization.disabled = req.disabled;

        const sideEffectsExecuted = await this.sideEffects(req.organizationId, req.disabled);
        if (sideEffectsExecuted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon executing side effects'));
        }
        
        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({organizationId: req.organizationId});
    }

    private async sideEffects(organizationId: string, disabled: boolean): Promise<Result<true | null, UseCaseError | null>> {
        const couponsSetDisabled = await this.couponRepo.setCouponsDisabledByOrganization(organizationId, disabled);
        if (couponsSetDisabled.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon setting coupons disabled'));
        }

        const employeesSetDisabled = await this.employeeRepo.setEmployeesDisabledByOrganization(organizationId, disabled);
        if (employeesSetDisabled.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon setting employees disabled'));
        }

        if (disabled) {
            const organizationRemovedFromFavoriteLists = await this.favoriteOrganizationListRepo.removeOrganizationFromMany(organizationId);
            if (organizationRemovedFromFavoriteLists.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon removing organization from favorite lists'));
            }
        }

        const purchasesSetArchived = await this.purchaseRepo.setManyArchivedByOrganization(organizationId, disabled);
        if (purchasesSetArchived.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon setting purchases archived'));
        }

        return Result.ok(true);
    }
}
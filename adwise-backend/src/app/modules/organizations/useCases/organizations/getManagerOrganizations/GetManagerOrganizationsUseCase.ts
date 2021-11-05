import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IAuthService } from "../../../../users/services/authService/IAuthService";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { GetManagerOrganizationsDTO } from "./GetManagerOrganizationsDTO";
import { getManagerOrganizationErrors } from "./getManagerOrganizationsErrors";

export class GetManagerOrganizationsUseCase implements IUseCase<GetManagerOrganizationsDTO.Request, GetManagerOrganizationsDTO.Response> {
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private authService: IAuthService;
    private couponRepo: ICouponRepo;
    private purchaseRepo: IPurchaseRepo;

    public errors = [
        ...getManagerOrganizationErrors
    ];

    constructor(userRepo: IUserRepo, organizationRepo: IOrganizationRepo, authService: IAuthService, couponRepo: ICouponRepo, purchaseRepo: IPurchaseRepo) {
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.authService = authService;
        this.couponRepo = couponRepo;
        this.purchaseRepo = purchaseRepo;
    }

    public async execute(req: GetManagerOrganizationsDTO.Request): Promise<GetManagerOrganizationsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m', 'User does not exist'));
        }

        const user = userFound.getValue()!;

        if (!user.wisewinId) {
            return Result.fail(UseCaseError.create('d', 'User is not manager'));
        }

        const organizationsFound = await this.organizationRepo.findByManager(user._id);
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const organizations = organizationsFound.getValue()!;

        const managerOrganizations: GetManagerOrganizationsDTO.IManagerOrganization[] = [];
        for (const organization of organizations) {
            const couponsFound = await this.couponRepo.findByOrganization(organization._id.toString(), 99999, 1, true);
            if (couponsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
            }

            const coupons = couponsFound.getValue()!;

            const purchasesFound = await this.purchaseRepo.findByOrganization(organization._id.toString(), 99999, 1, true);
            if (purchasesFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
            }

            const purchases = purchasesFound.getValue()!;

            const enabledCouponCount = coupons.filter(c => !c.disabled).length;
            const couponCount = coupons.length;

            const purchaseCount = purchases.length;
            const purchaseSum = Number(purchases.reduce((sum, cur) => sum += cur.sumInPoints, 0).toFixed(2));

            const managerOrganization: GetManagerOrganizationsDTO.IManagerOrganization = {
                organization: organization,
                jwt: '',
                couponCount,
                enabledCouponCount,
                purchaseCount,
                purchaseSum
            };

            const jwtCreated = await this.authService.sign({
                admin: false,
                userId: organization.user.toHexString(),
                adminGuest: false
            });

            if (jwtCreated.isSuccess) {
                managerOrganization.jwt = jwtCreated.getValue()!;
                managerOrganizations.push(managerOrganization);
            }
        }

        return Result.ok({organizations: managerOrganizations});
    }
}
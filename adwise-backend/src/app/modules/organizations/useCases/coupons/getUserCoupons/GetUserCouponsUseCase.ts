import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ICoupon } from "../../../models/Coupon";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { ICouponValidationService } from "../../../services/coupons/couponValidationService/ICouponValidationService";
import { GetUserHiddenCouponsUseCase } from "../../hiddenCouponLists/getUserHiddenCoupons/GetUserHiddenCouponsUseCase";
import { GetUserCouponsDTO } from "./GetUserCouponsDTO";
import { getUserCouponsErrors } from "./getUserCouponsErrors";

interface IKeyObjects {
    user: IUser;
    coupons: ICoupon[];
    contacts: IContact[];
    hiddenCoupons: ICoupon[];
};

interface IFilter {
    sortBy: string;
    order: number;
};

export class GetUserCouponsUseCase implements IUseCase<GetUserCouponsDTO.Request, GetUserCouponsDTO.Response> {
    private userRepo: IUserRepo;
    private couponRepo: ICouponRepo;
    private contactRepo: IContactRepo;
    private couponValidationService: ICouponValidationService;
    private getUserHiddenCouponsUseCase: GetUserHiddenCouponsUseCase;

    public errors = [
        ...getUserCouponsErrors
    ];

    constructor(
        userRepo: IUserRepo,
        couponRepo: ICouponRepo,
        contactRepo: IContactRepo,
        couponValidationService: ICouponValidationService,
        getUserHiddenCouponsUseCase: GetUserHiddenCouponsUseCase
    ) {
        this.userRepo = userRepo;
        this.couponRepo = couponRepo;
        this.contactRepo = contactRepo;
        this.couponValidationService = couponValidationService;
        this.getUserHiddenCouponsUseCase = getUserHiddenCouponsUseCase;
    }

    public async execute(req: GetUserCouponsDTO.Request): Promise<GetUserCouponsDTO.Response> {
        const valid = this.couponValidationService.getUserCouponsData(req);
        
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const filter = this.getFilter(req.sortBy, req.order);

        const keyObjectsGotten = await this.getKeyObjects(req.userId, filter.sortBy, filter.order);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            coupons,
            hiddenCoupons
        } = keyObjectsGotten.getValue()!;

        const shownCoupons: ICoupon[] = [];
        
        for (const coupon of coupons) {
            const isHidden = !!hiddenCoupons.find(c => c._id.toString() == coupon._id.toString());
            
            if (isHidden) continue;

            shownCoupons.push(coupon);
        }

        return Result.ok({
            coupons: shownCoupons
        });
    }

    private getFilter(sortBy: GetUserCouponsDTO.SortBy, order: number): IFilter {
        switch (sortBy) {
            case 'cashback':
                return {
                    sortBy: 'cashback',
                    order: order || -1
                };
            case 'disabled':
                return {
                    sortBy: 'disabled',
                    order: order || 1
                };
            case 'endDate':
                return {
                    sortBy: 'endDate',
                    order: order || 1
                };
            case 'price':
                return {
                    sortBy: 'price',
                    order: order || 1
                };
            case 'quantity':
                return {
                    sortBy: 'quantity',
                    order: order || 1
                };
            default:
                return {
                    sortBy: 'name',
                    order: -1
                };
        }
    }

    private async getKeyObjects(userId: string, sortBy: string, order: number): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const contactIds = user.contacts.map(c => c.toString());

        const contactsFound = await this.contactRepo.findByIds(contactIds);
        if (contactsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding contacts'));
        }

        const contacts = contactsFound.getValue()!;

        const couponIds: string[] = [];

        for (const contact of contacts) {
            couponIds.push(...contact.coupons.map(c => c.toString()));
        }

        const couponsFound = await this.couponRepo.searchByIdsAndDisabled(couponIds, false, sortBy, order, 'organization offer categories');
        if (couponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
        }

        const coupons = couponsFound.getValue()!;

        const hiddenCouponsFound = await this.getUserHiddenCouponsUseCase.execute({
            userId: userId
        });

        if (hiddenCouponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding hidden coupons'));
        }

        const hiddenCoupons = hiddenCouponsFound.getValue()!.coupons;

        return Result.ok({
            contacts,
            coupons,
            hiddenCoupons,
            user
        });
    }
}
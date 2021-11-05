import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { FavoriteCouponListModel } from "../../../models/FavoriteCouponList";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IFavoriteCouponListRepo } from "../../../repo/favoriteCouponLists/IFavoriteCouponListRepo";
import { GetUserFavoriteCouponsDTO } from "./GetUserFavoriteCouponsDTO";
import { getUserFavoriteCouponsErrors } from "./getUserFavoriteCouponsErrors";

export class GetUserFavoriteCouponsUseCase implements IUseCase<GetUserFavoriteCouponsDTO.Request, GetUserFavoriteCouponsDTO.Response> {
    private favoriteCouponListRepo: IFavoriteCouponListRepo;
    private couponRepo: ICouponRepo;

    public errors = getUserFavoriteCouponsErrors;

    constructor(favoriteCouponListRepo: IFavoriteCouponListRepo, couponRepo: ICouponRepo) {
        this.favoriteCouponListRepo = favoriteCouponListRepo;
        this.couponRepo = couponRepo;
    }

    public async execute(req: GetUserFavoriteCouponsDTO.Request): Promise<GetUserFavoriteCouponsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const favoriteCouponListFound = await this.favoriteCouponListRepo.findByUser(req.userId);
        if (favoriteCouponListFound.isFailure && favoriteCouponListFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding favirute coupon list'));
        }

        if (favoriteCouponListFound.isFailure && favoriteCouponListFound.getError()!.code == 404) {
            const favoriteCouponList = new FavoriteCouponListModel({
                user: req.userId,
                coupons: []
            });

            const favoriteCouponListSaved = await this.favoriteCouponListRepo.save(favoriteCouponList);
            if (favoriteCouponListSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving favorite coupon list'));
            }

            return Result.ok({coupons: []});
        }

        const favoriteCouponList = favoriteCouponListFound.getValue()!;

        if (!favoriteCouponList.coupons.length) {
            return Result.ok({coupons: []});
        }

        const couponIds =  favoriteCouponList.coupons.map(c => c.toString());

        const couponsFound = await this.couponRepo.searchByIdsAndDisabled(couponIds, false, '_id', -1, 'organization offer');
        if (couponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
        }

        const coupons = couponsFound.getValue()!;

        return Result.ok({coupons});
    }
}
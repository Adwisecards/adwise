import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { FavoriteCouponListModel } from "../../../models/FavoriteCouponList";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IFavoriteCouponListRepo } from "../../../repo/favoriteCouponLists/IFavoriteCouponListRepo";
import { RemoveCouponFromUserFavoriteListDTO } from "./RemoveCouponFromUserFavoriteListDTO";
import { removeCouponFromUserFavoriteListErrors } from './removeCouponFromUserFavoriteListErrors';

export class RemoveCouponFromUserFavoriteListUseCase implements IUseCase<RemoveCouponFromUserFavoriteListDTO.Request, RemoveCouponFromUserFavoriteListDTO.Response> {
    private favoriteCouponListRepo: IFavoriteCouponListRepo;
    private couponRepo: ICouponRepo;

    public errors = removeCouponFromUserFavoriteListErrors;

    constructor(favoriteCouponListRepo: IFavoriteCouponListRepo, couponRepo: ICouponRepo) {
        this.favoriteCouponListRepo = favoriteCouponListRepo;
        this.couponRepo = couponRepo;
    }

    public async execute(req: RemoveCouponFromUserFavoriteListDTO.Request): Promise<RemoveCouponFromUserFavoriteListDTO.Response> {
        if (!Types.ObjectId.isValid(req.couponId)) {
            return Result.fail(UseCaseError.create('c', 'couponId is not valid'));
        }

        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const favoriteCouponListFound = await this.favoriteCouponListRepo.findByUser(req.userId);
        if (favoriteCouponListFound.isFailure && favoriteCouponListFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', "error upon finding favoriteCouponList"));
        }

        if (favoriteCouponListFound.isFailure && favoriteCouponListFound.getError()!.code == 404) {
            const newFavoriteCouponList = new FavoriteCouponListModel({
                user: req.userId,
                coupons: []
            });

            const favoriteCouponListSaved = await this.favoriteCouponListRepo.save(newFavoriteCouponList);
            if (favoriteCouponListSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', "error upon saving favorite coupon list"));
            }

            return Result.fail(UseCaseError.create('q', 'Coupon is not in list'));
        }

        const favoriteCouponList = favoriteCouponListFound.getValue()!;

        const couponIndex = favoriteCouponList.coupons.findIndex(c => c.toString() == req.couponId);
        if (couponIndex == -1) {
            return Result.fail(UseCaseError.create('q', 'Coupon is not in list'));
        }

        favoriteCouponList.coupons.splice(couponIndex, 1);

        const favoriteCouponListSaved = await this.favoriteCouponListRepo.save(favoriteCouponList);
        if (favoriteCouponListSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving favorite coupon list'));
        }

        return Result.ok({couponId: req.couponId});
    }
}
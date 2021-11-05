import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { FavoriteCouponListModel, IFavoriteCouponList } from "../../../models/FavoriteCouponList";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IFavoriteCouponListRepo } from "../../../repo/favoriteCouponLists/IFavoriteCouponListRepo";
import { AddCouponToUserFavoriteListDTO } from "./AddCouponToUserFavoriteListDTO";
import { addCouponToUserFavoriteListErrors } from "./addCouponToUserFavoriteListErrors";

export class AddCouponToUserFavoriteListUseCase implements IUseCase<AddCouponToUserFavoriteListDTO.Request, AddCouponToUserFavoriteListDTO.Response> {
    private favoriteCouponListRepo: IFavoriteCouponListRepo;
    private couponRepo: ICouponRepo;
    
    public errors = addCouponToUserFavoriteListErrors;

    constructor(favoriteCouponListRepo: IFavoriteCouponListRepo, couponRepo: ICouponRepo) {
        this.favoriteCouponListRepo = favoriteCouponListRepo;
        this.couponRepo = couponRepo;
    }

    public async execute(req: AddCouponToUserFavoriteListDTO.Request): Promise<AddCouponToUserFavoriteListDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        if (!Types.ObjectId.isValid(req.couponId)) {
            return Result.fail(UseCaseError.create('c', 'couponId is not valid'));
        }

        let favoriteCouponList: IFavoriteCouponList;

        const favoriteCouponListFound = await this.favoriteCouponListRepo.findByUser(req.userId);
        if (favoriteCouponListFound.isFailure && favoriteCouponListFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding favorite coupon list'));
        }

        if (favoriteCouponListFound.isFailure && favoriteCouponListFound.getError()!.code == 404) {
            const newFavoriteCouponList = new FavoriteCouponListModel({
                user: req.userId,
                coupons: []
            });

            favoriteCouponList = newFavoriteCouponList;
        } else {
            favoriteCouponList = favoriteCouponListFound.getValue()!;
        }

        const favoriteCouponExists = !!favoriteCouponList!.coupons.find(c => c.toString() == req.couponId);
        if (favoriteCouponExists) {
            return Result.fail(UseCaseError.create('f', 'Coupon is already in list'));
        }

        const couponFound = await this.couponRepo.findById(req.couponId);
        if (couponFound.isFailure) {
            return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
        }

        const coupon = couponFound.getValue()!;

        favoriteCouponList.coupons.push(coupon._id);

        const favoriteCouponListSaved = await this.favoriteCouponListRepo.save(favoriteCouponList);
        if (favoriteCouponListSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving favorite coupon list'));
        }

        return Result.ok({couponId: req.couponId});
    }
}
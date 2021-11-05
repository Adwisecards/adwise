import c from "express-cluster";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { IOffer, OfferModel } from "../../../../finance/models/Offer";
import { IWallet } from "../../../../finance/models/Wallet";
import { IOfferRepo } from "../../../../finance/repo/offers/IOfferRepo";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { GenerateCouponDocumentUseCase } from "../../../../legal/useCases/couponDocuments/generateCouponDocument/GenerateCouponDocumentUseCase";
import { IAddress } from "../../../../maps/models/Address";
import { IAddressRepo } from "../../../../maps/repo/addresses/IAddressRepo";
import { IMedia } from "../../../../media/models/Media";
import { IMediaRepo } from "../../../../media/repo/IMediaRepo";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { CouponModel, ICoupon } from "../../../models/Coupon";
import { ICouponCategory } from "../../../models/CouponCategory";
import { IOrganization } from "../../../models/Organization";
import { ICouponCategoryRepo } from "../../../repo/couponCategories/ICouponCategoryRepo";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { ICouponValidationService } from "../../../services/coupons/couponValidationService/ICouponValidationService";
import { CreateCouponDTO } from "./CreateCouponDTO";
import { createCouponErrors } from "./createCouponErrors";

interface IKeyObjects {
    pictureMedia?: IMedia;
    documentMedia?: IMedia;
    locationAddress: IAddress;
    termsDocumentMedia?: IMedia;
    organization: IOrganization;
    user: IUser;
    organizationWallet: IWallet;
    organizationCoupons: ICoupon[];
    couponCategories: ICouponCategory[];
};

export class CreateCouponUseCase implements IUseCase<CreateCouponDTO.Request, CreateCouponDTO.Response> {
    private offerRepo: IOfferRepo;
    private couponRepo: ICouponRepo;
    private organizationRepo: IOrganizationRepo;
    private couponValidationService: ICouponValidationService;
    private mediaService: IMediaService;
    private mediaRepo: IMediaRepo;
    private createRefUseCase: CreateRefUseCase;
    private addressRepo: IAddressRepo;
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private couponCategoryRepo: ICouponCategoryRepo;
    private generateCouponDocumentUseCase: GenerateCouponDocumentUseCase;

    public errors: UseCaseError[] = createCouponErrors;

    constructor(
        offerRepo: IOfferRepo, 
        couponRepo: ICouponRepo, 
        organizationRepo: IOrganizationRepo, 
        couponValidationService: ICouponValidationService, 
        mediaService: IMediaService,
        mediaRepo: IMediaRepo, 
        createRefUseCase: CreateRefUseCase,
        addressRepo: IAddressRepo,
        userRepo: IUserRepo,
        walletRepo: IWalletRepo,
        couponCategoryRepo: ICouponCategoryRepo,
        generateCouponDocumentUseCase: GenerateCouponDocumentUseCase
    ) {
        this.offerRepo = offerRepo;
        this.couponRepo = couponRepo;
        this.organizationRepo = organizationRepo;
        this.couponValidationService = couponValidationService;
        this.mediaService = mediaService;
        this.mediaRepo = mediaRepo;
        this.createRefUseCase = createRefUseCase;
        this.addressRepo = addressRepo;
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.couponCategoryRepo = couponCategoryRepo;
        this.generateCouponDocumentUseCase = generateCouponDocumentUseCase;
    }

    public async execute(req: CreateCouponDTO.Request): Promise<CreateCouponDTO.Response> {
        const valid = this.couponValidationService.createCouponData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.organizationId, req.couponCategoryIds, req.pictureMediaId, req.documentMediaId, req.termsDocumentMediaId, req.locationAddressId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            documentMedia,
            locationAddress,
            pictureMedia,
            termsDocumentMedia,
            organization,
            organizationCoupons,
            organizationWallet,
            user,
            couponCategories
        } = keyObjectsGotten.getValue()!;

        if (!organization.packet || organizationCoupons.length == organization.packet.limit) {
            return Result.fail(UseCaseError.create('1'));
        }

        if (organization.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        if (couponCategories.length && !!couponCategories.find(c => c.organization.toString() != organization._id.toString())) {
            return Result.fail(UseCaseError.create('d', 'Coupon category is not of organization'));
        }

        if (couponCategories.length && !!couponCategories.find(c => c.disabled)) {
            return Result.fail(UseCaseError.create('c', 'Coupon category is disabled'));
        }

        const offer = new OfferModel({
            type: req.offerType,
            currency: organizationWallet.currency,
            [req.offerType == 'cashback' ? 'percent' : 'points']: req.offerType == 'cashback' ? req.offerPercent : req.offerPoints,
        });

        const coupon = new CouponModel({
            organizationPicture: organization.mainPicture,
            organizationBriefDescription: organization.briefDescription,
            organizationName: organization.name,
            organizationCategory: organization.category.name,
            offer: offer._id,
            description: req.description,
            organization: organization._id,
            picture: pictureMedia ? this.mediaService.getAbsolutePath(pictureMedia?.filename) : undefined as any,
            name: req.name,
            quantity: req.quantity,
            initialQuantity: req.quantity,
            distributionSchema: {
                first: req.distributionSchema.first,
                other: req.distributionSchema.other / 20
            },
            startDate: req.startDate,
            endDate: req.endDate,
            document: documentMedia ? this.mediaService.getAbsolutePath(documentMedia?.filename) : undefined as any,
            documentMedia: documentMedia?._id,
            termsDocument: termsDocumentMedia ? this.mediaService.getAbsolutePath(termsDocumentMedia?.filename) : undefined as any,
            termsDocumentMedia: termsDocumentMedia?._id,
            price: req.price,
            paid: req.price ? false : undefined,
            location: locationAddress,
            index: req.index,
            type: req.type,
            pictureMedia: pictureMedia?._id.toString(),
            ageRestricted: req.ageRestricted,
            categories: couponCategories.map(c => c._id.toString()),
            floating: req.floating,
            disabled: req.disabled || false
        });

        offer.coupon = coupon._id;

        const refCreated = await this.createRefUseCase.execute({
            ref: coupon._id.toString(),
            mode: 'coupon',
            type: 'purchase'
        });

        if (refCreated.isFailure) {
            console.log(refCreated.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
        }

        const ref = refCreated.getValue()!;

        coupon.ref = ref;

        organization.coupons.push(coupon._id);

        const offerSaved = await this.offerRepo.save(offer);
        if (offerSaved.isFailure) {
            console.log(offerSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon saving offer'));
        }

        const couponSaved = await this.couponRepo.save(coupon);
        if (couponSaved.isFailure) {
            console.log(couponSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon saving coupon'));
        }

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            console.log(organizationSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        await this.generateCouponDocumentUseCase.execute({
            couponId: coupon._id.toString(),
            type: 'terms',
            userId: user._id.toString()
        });

        return Result.ok({couponId: coupon._id});
    }

    private async getKeyObjects(userId: string, organizationId: string, couponCategoryIds: string[], pictureMediaId: string, documentMediaId: string, termsDocumentMediaId: string, locationAddressId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding user") : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;
        
        let pictureMedia: IMedia | undefined;

        if (pictureMediaId) {
            const pictureMediaFound = await this.mediaRepo.findById(pictureMediaId);
            if (pictureMediaFound.isFailure) {
                return Result.fail(pictureMediaFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding picture media') : UseCaseError.create('a5', 'Picture media does not exist'));
            }

            pictureMedia = pictureMediaFound.getValue()!;
        }

        let documentMedia: IMedia | undefined;

        if (documentMediaId) {
            const documentMediaFound = await this.mediaRepo.findById(documentMediaId);
            if (documentMediaFound.isFailure) {
                return Result.fail(documentMediaFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding document media') : UseCaseError.create('a5', 'Document media does not exist'));
            }

            documentMedia = documentMediaFound.getValue()!;
        }

        let termsDocumentMedia: IMedia | undefined;

        if (termsDocumentMediaId) {
            const termsDocumentMediaFound = await this.mediaRepo.findById(termsDocumentMediaId);
            if (termsDocumentMediaFound.isFailure) {
                return Result.fail(termsDocumentMediaFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding terms document media') : UseCaseError.create('a5', 'Terms document media does not exist'));
            }

            termsDocumentMedia = termsDocumentMediaFound.getValue()!;
        }

        const locationAddressFound = await this.addressRepo.findById(locationAddressId);
        if (locationAddressFound.isFailure) {
            return Result.fail(locationAddressFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding location address') : UseCaseError.create('a9', 'Location address does not exist'));
        }

        const locationAddress = locationAddressFound.getValue()!;

        const organizationWalletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (organizationWalletFound.isFailure) {
            return Result.fail(organizationWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization wallet') : UseCaseError.create('r', 'Organization wallet does not exist'));
        }
        
        const organizationWallet = organizationWalletFound.getValue()!;

        const organizationCouponsFound = await this.couponRepo.findByOrganization(organization._id.toString(), 9999, 1, false);
        if (organizationCouponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
        }

        const organizationCoupons = organizationCouponsFound.getValue()!;

        let couponCategories: ICouponCategory[] = [];
        if (couponCategoryIds?.length) {
            const couponCategoriesFound = await this.couponCategoryRepo.findByIds(couponCategoryIds);
            if (couponCategoriesFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding coupon categories'));
            }

            couponCategories = couponCategoriesFound.getValue()!;
        }

        return Result.ok({
            documentMedia,
            locationAddress,
            pictureMedia,
            termsDocumentMedia,
            organization,
            user,
            organizationCoupons,
            organizationWallet,
            couponCategories
        });
    }
}
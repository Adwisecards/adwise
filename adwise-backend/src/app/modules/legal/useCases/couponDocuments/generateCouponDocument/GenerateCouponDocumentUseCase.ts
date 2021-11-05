import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { configProps } from "../../../../../services/config";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { IPDFService } from "../../../../../services/pdfService/IPDFService";
import { IOffer } from "../../../../finance/models/Offer";
import { IOfferRepo } from "../../../../finance/repo/offers/IOfferRepo";
import { IMedia } from "../../../../media/models/Media";
import { IMediaRepo } from "../../../../media/repo/IMediaRepo";
import { CreateMediaUseCase } from "../../../../media/useCases/createMedia/CreateMediaUseCase";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IOrganization } from "../../../../organizations/models/Organization";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { CouponDocumentModel, ICouponDocument } from "../../../models/CouponDocument";
import { ILegal } from "../../../models/Legal";
import { ICouponDocumentRepo } from "../../../repo/couponDocuments/ICouponDocumentRepo";
import { ILegalRepo } from "../../../repo/legal/ILegalRepo";
import { ICouponDocumentValidationService } from "../../../services/couponDocuments/couponDocuments/couponDocumentValidationService/ICouponDocumentValidationService";
import { GenerateCouponDocumentDTO } from "./GenerateCouponDocumentDTO";
import { generateCouponDocumentErrors } from "./generateCouponDocumentErrors";

interface IKeyObjects {
    termsDocumentMedia?: IMedia;
    organization: IOrganization;
    coupon: ICoupon;
    offer: IOffer;
    legal: ILegal;
    user: IUser;
};

export class GenerateCouponDocumentUseCase implements IUseCase<GenerateCouponDocumentDTO.Request, GenerateCouponDocumentDTO.Response> {
    private userRepo: IUserRepo;
    private offerRepo: IOfferRepo;
    private mediaRepo: IMediaRepo;
    private legalRepo: ILegalRepo;
    private couponRepo: ICouponRepo;
    private pdfService: IPDFService;
    private mediaService: IMediaService;
    private organizationRepo: IOrganizationRepo;
    private createMediaUseCase: CreateMediaUseCase;
    private couponDocumentRepo: ICouponDocumentRepo;
    private couponDocumentValidationService: ICouponDocumentValidationService;

    public errors = generateCouponDocumentErrors;

    constructor(
        userRepo: IUserRepo,
        offerRepo: IOfferRepo,
        mediaRepo: IMediaRepo,
        legalRepo: ILegalRepo,
        couponRepo: ICouponRepo,
        pdfService: IPDFService,
        mediaService: IMediaService,
        organizationRepo: IOrganizationRepo,
        createMediaUseCase: CreateMediaUseCase,
        couponDocumentRepo: ICouponDocumentRepo,
        couponDocumentValidationService: ICouponDocumentValidationService
    ) {
        this.userRepo = userRepo;
        this.offerRepo = offerRepo;
        this.mediaRepo = mediaRepo;
        this.legalRepo = legalRepo;
        this.couponRepo = couponRepo;
        this.pdfService = pdfService;
        this.mediaService = mediaService;
        this.organizationRepo = organizationRepo;
        this.createMediaUseCase = createMediaUseCase;
        this.couponDocumentRepo = couponDocumentRepo;
        this.couponDocumentValidationService = couponDocumentValidationService;
    }

    public async execute(req: GenerateCouponDocumentDTO.Request): Promise<GenerateCouponDocumentDTO.Response> {
        const valid = this.couponDocumentValidationService.generateCouponDocumentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.couponId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            termsDocumentMedia,
            organization,
            coupon,
            offer,
            legal,
            user
        } = keyObjectsGotten.getValue()!;

        if (user.organization?.toString() != coupon.organization.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        const couponDocumentGenerated = await this.generateCouponDocument(
            req.type,
            coupon,
            organization,
            legal,
            offer,
            termsDocumentMedia
        );

        if (couponDocumentGenerated.isFailure) {
            return Result.fail(couponDocumentGenerated.getError());
        }

        const couponDocumentData = couponDocumentGenerated.getValue()!;

        const couponDocumentUpdated = await this.updateCouponDocument(coupon._id.toString(), couponDocumentData, req.type);
        if (couponDocumentUpdated.isFailure) {
            return Result.fail(couponDocumentUpdated.getError()!);
        }

        const couponDocument = couponDocumentUpdated.getValue()!;

        return Result.ok({couponDocumentId: couponDocument._id.toString()});
    }

    private async updateCouponDocument(couponId: string, couponDocumentData: Buffer, type: string): Promise<Result<ICouponDocument | null, UseCaseError | null>> {
        const documentMediaCreated = await this.createMediaUseCase.execute({
            data: couponDocumentData,
            type: 'image',
            mimeType: 'application/pdf'
        });

        if (documentMediaCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating document media'));
        }

        const { mediaId: documentMediaId } = documentMediaCreated.getValue()!;
        
        let couponDocument: ICouponDocument | undefined;

        const couponDocumentFound = await this.couponDocumentRepo.findByCouponAndType(couponId, type);
        if (couponDocumentFound.isFailure && couponDocumentFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupon document'));
        }

        if (couponDocumentFound.isFailure && couponDocumentFound.getError()!.code == 404) {
            couponDocument = new CouponDocumentModel({
                type: type,
                documentMedia: documentMediaId,
                coupon: couponId
            });
        } else {
            couponDocument = couponDocumentFound.getValue()!;
            
            couponDocument.documentMedia = new Types.ObjectId(documentMediaId);
            couponDocument.updatedAt = new Date();
        }

        const couponDocumentSaved = await this.couponDocumentRepo.save(couponDocument);
        if (couponDocumentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving coupon document'));
        }

        return Result.ok(couponDocument);
    }

    private async generateCouponDocument(type: string, coupon: ICoupon, organization: IOrganization, legal: ILegal, offer: IOffer, termsDocumentMedia?: IMedia): Promise<Result<Buffer | null, UseCaseError | null>> {
        switch (type) {
            case 'terms':
                return await this.generateTermsDocument(coupon, organization, legal, offer, termsDocumentMedia);
            default:
                return Result.fail(UseCaseError.create('a', 'Unknown type'));
        }
    }

    private async generateTermsDocument(coupon: ICoupon, organization: IOrganization, legal: ILegal, offer: IOffer, termsDocumentMedia?: IMedia): Promise<Result<Buffer | null, UseCaseError | null>> {
        const termsDocumentGenerated = await this.pdfService.generatePDF('couponTerms', {
            couponName: coupon.name || '-',
            couponCode: coupon.ref.code || '-',
            couponUrl: `${configProps.frontendUrl}/organization/${organization._id}` || '-',
            organizationName: legal.info.organizationName || '-',
            organizationPhone: legal.info.phone || organization.phones[0] || '-',
            couponLocation: coupon.location.placeId || coupon.location.toString() || '-',
            
            dateFromDate: coupon.startDate?.getDate() || '-',
            dateFromMonth: this.formatMonth(coupon.startDate?.getMonth()) || '-',
            dateFromYear: coupon.startDate?.getFullYear() || '-',
            dateToDate: coupon.endDate?.getDate() || '-',
            dateToMonth: this.formatMonth(coupon.endDate?.getMonth()) || '-',
            dateToYear: coupon.endDate?.getFullYear() || '-',
            
            couponFirstLevel: coupon.distributionSchema.first,
            couponOtherLevel: coupon.distributionSchema.other,
            couponCashback: offer.percent,
            couponTermsDocumentUrl: coupon.termsDocument || termsDocumentMedia ? this.mediaService.getAbsolutePath(termsDocumentMedia!.filename) : '-'
        });

        if (termsDocumentGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', "Error upon generating terms document"));
        }

        const termsDocument = termsDocumentGenerated.getValue()!;

        return Result.ok(termsDocument);
    }

    private async getKeyObjects(userId: string, couponId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding user") : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const couponFound = await this.couponRepo.findById(couponId);
        if (couponFound.isFailure) {
            return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
        }

        const coupon = couponFound.getValue()!;

        const offerFound = await this.offerRepo.findById(coupon.offer.toString());
        if (offerFound.isFailure) {
            return Result.fail(offerFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding offer') : UseCaseError.create('p'));
        }

        const offer = offerFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(coupon.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let termsDocumentMedia: IMedia | undefined;

        if (coupon.termsDocumentMedia) {
            const termsDocumentMediaFound = await this.mediaRepo.findById(coupon.termsDocumentMedia.toString());
            if (termsDocumentMediaFound.isSuccess) {
                termsDocumentMedia = termsDocumentMediaFound.getValue()!;
            }
        }

        const legalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (legalFound.isFailure) {
            return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal') : UseCaseError.create('b4'));
        }

        const legal = legalFound.getValue()!;
    
        return Result.ok({
            termsDocumentMedia,
            organization,
            coupon,
            offer,
            legal,
            user
        });
    }

    private formatMonth(month: number): string {
        const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

        return months[month];
    }
}
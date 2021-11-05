import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../services/mediaService/IMediaService";
import { ICouponRepo } from "../../../organizations/repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../organizations/repo/organizations/IOrganizationRepo";
import { CreateMediaUseCase } from "../createMedia/CreateMediaUseCase";
import { ConvertToMediaDTO } from "./ConvertToMediaDTO";
import { convertToMediaErrors } from "./convertToMediaErrors";
import mime from 'mime-types';
import { Types } from "mongoose";
import FileType from 'file-type';

export class ConvertToMediaUseCase implements IUseCase<ConvertToMediaDTO.Request, ConvertToMediaDTO.Response> {
    private couponRepo: ICouponRepo;
    private mediaService: IMediaService;
    private organizationRepo: IOrganizationRepo;
    private createMediaUseCase: CreateMediaUseCase;

    public errors = convertToMediaErrors;

    constructor(
        couponRepo: ICouponRepo,
        mediaService: IMediaService,
        organizationRepo: IOrganizationRepo,
        createMediaUseCase: CreateMediaUseCase
    ) {
        this.couponRepo = couponRepo;
        this.mediaService = mediaService;
        this.organizationRepo = organizationRepo;
        this.createMediaUseCase = createMediaUseCase;
    }

    public async execute(_: ConvertToMediaDTO.Request): Promise<ConvertToMediaDTO.Response> {
        const couponsFound = await this.couponRepo.getAll();
        if (couponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
        }

        const coupons = couponsFound.getValue()!;

        for (const coupon of coupons) {
            if (!coupon.picture || coupon.pictureMedia) {
                continue;
            }

            const pathParts = coupon.picture.split('/');
            const filename = pathParts[pathParts.length - 1];
            let mimeType = mime.lookup(filename);

            const mediaGotten = await this.mediaService.get(filename);

            if (mediaGotten.isSuccess) {
                const mediaData = mediaGotten.getValue()!;
                if (!mimeType) {
                    console.log(mimeType, '=>');
                    const mimeTypeFromBuffer = await FileType.fromBuffer(mediaData);
                    mimeType = mimeTypeFromBuffer?.mime as string;
                    console.log('=>', mimeType);
                }

                const mediaCreated = await this.createMediaUseCase.execute({
                    data: mediaData,
                    mimeType: mimeType.toString(),
                    type: 'image'
                });

                if (mediaCreated.isSuccess) {
                    const { mediaId } = mediaCreated.getValue()!;

                    coupon.pictureMedia = new Types.ObjectId(mediaId);
    
                    const couponSaved = await this.couponRepo.save(coupon);
                    if (couponSaved.isSuccess) {
                        console.log('SUCCESS');
                    }
                }
            }
        }

        const organizationsFound = await this.organizationRepo.getAll();
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const organizations = organizationsFound.getValue()!;

        for (const organization of organizations) {
            if (organization.picture) {
                const picturePathParts = organization.picture.split('/');
                const pictureFilename = picturePathParts[picturePathParts.length - 1];
                let pictureMimeType = mime.lookup(pictureFilename);

                const pictureMediaGotten = await this.mediaService.get(pictureFilename);
                if (pictureMediaGotten.isSuccess) {
                    const pictureMediaData = pictureMediaGotten.getValue()!;
                    if (!pictureMimeType) {
                        console.log(pictureMimeType, '=>');
                        const mimeTypeFromBuffer = await FileType.fromBuffer(pictureMediaData);
                        pictureMimeType = mimeTypeFromBuffer?.mime as string;
                        console.log('=>', pictureMimeType);
                    }

                    const pictureMediaCreated = await this.createMediaUseCase.execute({
                        data: pictureMediaData,
                        mimeType: pictureMimeType.toString(),
                        type: 'image'
                    });

                    if (pictureMediaCreated.isSuccess) {
                        const { mediaId: pictureMediaId } = pictureMediaCreated.getValue()!;

                        organization.pictureMedia = new Types.ObjectId(pictureMediaId);
                    }
                }
            }

            //

            if (organization.mainPicture) {
                const mainPicturePathParts = organization.mainPicture.split('/');
                const mainPictureFilename = mainPicturePathParts[mainPicturePathParts.length - 1];
                let mainPictureMimeType = mime.lookup(mainPictureFilename);

                const mainPictureMediaGotten = await this.mediaService.get(mainPictureFilename);
                if (mainPictureMediaGotten.isSuccess) {
                    const mainPictureMediaData = mainPictureMediaGotten.getValue()!;
                    if (!mainPictureMimeType) {
                        console.log(mainPictureMimeType, '=>');
                        const mimeTypeFromBuffer = await FileType.fromBuffer(mainPictureMediaData);
                        mainPictureMimeType = mimeTypeFromBuffer?.mime as string;
                        console.log('=>', mainPictureMimeType);
                    }

                    const mainPictureMediaCreated = await this.createMediaUseCase.execute({
                        data: mainPictureMediaData,
                        mimeType: mainPictureMimeType.toString(),
                        type: 'image'
                    });

                    if (mainPictureMediaCreated.isSuccess) {
                        const { mediaId: mainPictureMediaId } = mainPictureMediaCreated.getValue()!;

                        organization.mainPictureMedia = new Types.ObjectId(mainPictureMediaId);
                    }
                }
            }

            const organizationSaved = await this.organizationRepo.save(organization);
            if (organizationSaved.isSuccess) {
                console.log('SUCCESS2');
            }
        }

        return Result.ok({});
    }
}
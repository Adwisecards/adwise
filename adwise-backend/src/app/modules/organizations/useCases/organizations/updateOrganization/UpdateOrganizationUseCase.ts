import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { UpdateOrganizationDTO } from "./UpdateOrganizationDTO";
import { updateOrganizationErrors } from "./updateOrganizationErrors";
import {IOrganizationValidationService} from '../../../services/organizations/organizationValidationService/IOrganizationValidationService';
import { Types } from "mongoose";
import { Result } from "../../../../../core/models/Result";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { ITagRepo } from "../../../repo/tags/ITagRepo";
import { ICategoryRepo } from "../../../repo/categories/ICategoryRepo";
import { IMapsService } from "../../../../../services/mapsService/IMapsService";
import { IPDFService } from "../../../../../services/pdfService/IPDFService";
import { IPacket } from "../../../models/Packet";
import { IAddressRepo } from "../../../../maps/repo/addresses/IAddressRepo";
import { IMediaRepo } from "../../../../media/repo/IMediaRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganization } from "../../../models/Organization";
import { IUser } from "../../../../users/models/User";
import { IMedia } from "../../../../media/models/Media";
import { IAddress } from "../../../../maps/models/Address";
import { ICategory } from "../../../models/Category";

interface IKeyObjects {
    organization: IOrganization;
    user: IUser;
    pictureMedia?: IMedia;
    mainPictureMedia?: IMedia;
    address?: IAddress;
    category?: ICategory;
};

export class UpdateOrganizationUseCase implements IUseCase<UpdateOrganizationDTO.Request, UpdateOrganizationDTO.Response> {
    private tagRepo: ITagRepo;
    private userRepo: IUserRepo;
    private mediaRepo: IMediaRepo;
    private mapsService: IMapsService;
    private addressRepo: IAddressRepo;
    private categoryRepo: ICategoryRepo;
    private mediaService: IMediaService;
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;

    public errors = updateOrganizationErrors;

    constructor(
        tagRepo: ITagRepo,
        userRepo: IUserRepo,
        mediaRepo: IMediaRepo,
        mapsService: IMapsService,
        addressRepo: IAddressRepo,
        categoryRepo: ICategoryRepo,
        mediaService: IMediaService,
        organizationRepo: IOrganizationRepo, 
        organizationValidationService: IOrganizationValidationService,
    ) {
        this.tagRepo = tagRepo;
        this.userRepo = userRepo;
        this.mediaRepo = mediaRepo;
        this.mapsService = mapsService;
        this.addressRepo = addressRepo;
        this.categoryRepo = categoryRepo;
        this.mediaService = mediaService;
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
    }

    public async execute(req: UpdateOrganizationDTO.Request): Promise<UpdateOrganizationDTO.Response> {
        const valid = this.organizationValidationService.updateOrganizationData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.organizationId, req.userId, req.categoryId, req.addressId, req.pictureMediaId, req.mainPictureMediaId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        let {
            organization,
            user,
            address,
            mainPictureMedia,
            pictureMedia,
            category
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        if (req.tags && req.tags.length) {
            const tagsSaved = await this.tagRepo.saveNew(req.tags);
            if (tagsSaved.isFailure) {
                return Result.fail(UseCaseError.create('a'));
            }
            
            const tags = tagsSaved.getValue()!;
            organization.tags = tags;
        }

        if (address) {
            organization.address = address;
        }

        if (mainPictureMedia) {
            organization.mainPictureMedia = mainPictureMedia._id.toString();
            organization.mainPicture = this.mediaService.getAbsolutePath(mainPictureMedia.filename);
        }

        if (pictureMedia) {
            organization.pictureMedia = pictureMedia._id.toString();
            organization.picture = this.mediaService.getAbsolutePath(pictureMedia.filename);
        }

        if (category) {
            organization.category = category;
        }

        for (const key in req) {
            organization = this.updateField(organization, key, (<any>req)[key]);
        }

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            console.log(organizationSaved.getError())
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({organizationId: req.organizationId!});
    }

    private updateField(organization: IOrganization, key: string, value: any): IOrganization {
        if (key == 'addressCoords' && value != undefined) {
            organization.address.coords = value;
            return organization;
        }

        if (key == 'distributionSchema' && value != undefined) {
            organization.distributionSchema.first = value.first;
            organization.distributionSchema.other = value.other / 20;
            return organization;
        }

        console.log(organization.distributionSchema);

        if (key == 'tags') {
            return organization;
        }

        if (key == 'category') {
            return organization;
        }

        if (key == 'pictureMediaId' && value == undefined) {
            organization.pictureMedia = undefined as any;
            organization.picture = undefined as any;
            return organization;
        }

        if (key == 'mainPictureMediaId' && value == undefined) {
            organization.mainPictureMedia = undefined as any;
            organization.mainPicture = undefined as any;
            return organization;
        }
        
        if (!key.toLowerCase().includes('id') && value != undefined) {
            (<any>organization)[key] = value;
        }

        return organization;
    }

    private async getKeyObjects(organizationId: string, userId: string, categoryId?: string, addressId?: string, pictureMediaId?: string, mainPictureMediaId?: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        let pictureMedia: IMedia | undefined;
        if (pictureMediaId) {
            const pictureMediaFound = await this.mediaRepo.findById(pictureMediaId);
            if (pictureMediaFound.isFailure) {
                return Result.fail(pictureMediaFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding picture media') : UseCaseError.create('a5', 'Picture media does not exist'));
            } 

            pictureMedia = pictureMediaFound.getValue()!;
        }

        let mainPictureMedia: IMedia | undefined;
        if (mainPictureMediaId) {
            const mainPictureMediaFound = await this.mediaRepo.findById(mainPictureMediaId);
            if (mainPictureMediaFound.isFailure) {
                return Result.fail(mainPictureMediaFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding main picture media') : UseCaseError.create('a5', 'Main picture media does not exist'));
            }

            mainPictureMedia = mainPictureMediaFound.getValue()!;
        }

        let address: IAddress | undefined;
        if (addressId) {
            const addressFound = await this.addressRepo.findById(addressId);
            if (addressFound.isFailure) {
                return Result.fail(addressFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding address') : UseCaseError.create('a9'));
            }

            address = addressFound.getValue()!;
        }

        let category: ICategory | undefined;
        if (categoryId) {
            const categoryFound = await this.categoryRepo.findById(categoryId);
            if (categoryFound.isFailure) {
                return Result.fail(categoryFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding category") : UseCaseError.create('j'))
            }

            category = categoryFound.getValue()!;
        }
        
        return Result.ok({
            organization,
            user,
            address,
            mainPictureMedia,
            pictureMedia,
            category
        });
    }
}


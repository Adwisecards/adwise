import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { ITelegramService } from "../../../../../services/telegramService/ITelegramService";
import { IWallet } from "../../../../finance/models/Wallet";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { CreateWalletUseCase } from "../../../../finance/useCases/wallets/createWallet/CreateWalletUseCase";
import { GenerateOrganizationDocumentUseCase } from "../../../../legal/useCases/organizationDocuments/generateOrganizationDocument/GenerateOrganizationDocumentUseCase";
import { IAddress } from "../../../../maps/models/Address";
import { IAddressRepo } from "../../../../maps/repo/addresses/IAddressRepo";
import { IMedia } from "../../../../media/models/Media";
import { IMediaRepo } from "../../../../media/repo/IMediaRepo";
import { IRef } from "../../../../ref/models/Ref";
import { IRefRepo } from "../../../../ref/repo/IRefRepo";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { IUser, UserModel } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ICategory } from "../../../models/Category";
import { DistributionModel } from "../../../models/DistributionSchema";
import { IEmployee } from "../../../models/Employee";
import { IOrganization, OrganizationModel } from "../../../models/Organization";
import { ITag } from "../../../models/Tag";
import { ICategoryRepo } from "../../../repo/categories/ICategoryRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { ITagRepo } from "../../../repo/tags/ITagRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { CreateEmployeeUseCase } from "../../employees/createEmployee/CreateEmployeeUseCase";
import { RequestPacketUseCase } from "../../packets/requestPacket/RequestPacketUseCase";
import { CreateOrganizationDTO } from "./CreateOrganizationDTO";
import { createOrganizationErrors } from "./createOrganizationErrors";

interface IKeyObjects {
    user: IUser;
    pictureMedia?: IMedia;
    mainPictureMedia?: IMedia;
    address: IAddress;
    category: ICategory;
};

interface IRollback {
    toSave: {
        user?: IUser;
    };
    toDelete: {
        organizationId?: string;
        walletId?: string;
        tagIds?: string[];
        refId?: string;
    }
};

export class CreateOrganizationUseCase implements IUseCase<CreateOrganizationDTO.Request, CreateOrganizationDTO.Response> {
    private generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase;
    private organizationValidationService: IOrganizationValidationService;
    private createEmployeeUseCase: CreateEmployeeUseCase;
    private requestPacketUseCase: RequestPacketUseCase;
    private createWalletUseCase: CreateWalletUseCase;
    private organizationRepo: IOrganizationRepo;
    private createRefUseCase: CreateRefUseCase;
    private telegramService: ITelegramService;
    private categoryRepo: ICategoryRepo;
    private mediaService: IMediaService;
    private addressRepo: IAddressRepo;
    private walletRepo: IWalletRepo;
    private mediaRepo: IMediaRepo;
    private userRepo: IUserRepo;
    private tagRepo: ITagRepo;
    private refRepo: IRefRepo;

    public errors = createOrganizationErrors;

    private rollback: IRollback = {
        toSave: {
            user: undefined
        },
        toDelete: {
            organizationId: undefined,
            walletId: undefined,
            tagIds: undefined,
            refId: undefined
        }
    };
    
    constructor(
        generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase,
        organizationValidationService: IOrganizationValidationService, 
        createEmployeeUseCase: CreateEmployeeUseCase,
        requestPacketUseCase: RequestPacketUseCase,
        createWalletUseCase: CreateWalletUseCase, 
        organizationRepo: IOrganizationRepo,
        createRefUseCase: CreateRefUseCase,
        telegramService: ITelegramService,
        categoryRepo: ICategoryRepo,
        mediaService: IMediaService,
        addressRepo: IAddressRepo,
        walletRepo: IWalletRepo,
        mediaRepo: IMediaRepo,
        userRepo: IUserRepo,
        tagRepo: ITagRepo,
        refRepo: IRefRepo
    ) {
        this.generateOrganizationDocumentUseCase = generateOrganizationDocumentUseCase;
        this.organizationValidationService = organizationValidationService;
        this.createEmployeeUseCase = createEmployeeUseCase;
        this.requestPacketUseCase = requestPacketUseCase;
        this.createWalletUseCase = createWalletUseCase;
        this.organizationRepo = organizationRepo;
        this.createRefUseCase = createRefUseCase;
        this.telegramService = telegramService;
        this.categoryRepo = categoryRepo;
        this.mediaService = mediaService;
        this.addressRepo = addressRepo;
        this.walletRepo = walletRepo;
        this.mediaRepo = mediaRepo;
        this.userRepo = userRepo;
        this.tagRepo = tagRepo;
        this.refRepo = refRepo;
    }

    public async execute(req: CreateOrganizationDTO.Request): Promise<CreateOrganizationDTO.Response> {
        const valid = this.organizationValidationService.createOrganizationData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.categoryId, req.addressId, req.pictureMediaId, req.mainPictureMediaId);
        if (keyObjectsGotten.isFailure) {
            await this.doRollback();
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            address,
            user,
            category,
            mainPictureMedia,
            pictureMedia
        } = keyObjectsGotten.getValue()!;

        this.rollback.toSave.user = user.toObject();
        
        const tagsSaved = await this.tagRepo.saveNew(req.tags);
        if (tagsSaved.isFailure) {
            await this.doRollback();
            return Result.fail(UseCaseError.create('a', 'Error upon saving tags'));
        }

        const tags = tagsSaved.getValue()!;

        this.rollback.toDelete.tagIds = tags.map(t => t._id.toString());

        const organization = new OrganizationModel({
            name: req.name,
            briefDescription: req.briefDescription,
            address: address,
            emails: req.emails,
            category: category,
            tags: tags,
            phones: req.phones,
            distributionSchema: new DistributionModel({
                first: Number(req.distributionSchema.first),
                other: Number(req.distributionSchema.other) / 20
            }),
            description: req.description,
            picture: pictureMedia ? this.mediaService.getAbsolutePath(pictureMedia.filename) : undefined as any,
            mainPicture: mainPictureMedia ? this.mediaService.getAbsolutePath(mainPictureMedia.filename) : undefined as any,
            cashback: req.cashback,
            colors: req.colors,
            mainPictureMedia: mainPictureMedia?._id,
            pictureMedia: pictureMedia?._id,
            schedule: req.schedule,
            socialMedia: req.socialMedia
        });

        this.rollback.toDelete.organizationId = organization._id.toString();

        const walletCreated = await this.createWalletUseCase.execute({
            currency: 'rub',
            organizationId: organization._id.toString()
        });
        if (walletCreated.isFailure) {
            await this.doRollback();
            return Result.fail(UseCaseError.create('a', 'Error upon creating wallet'));
        }

        const wallet = walletCreated.getValue()!;

        organization.wallet = wallet.walletId as any;

        console.log(organization.wallet);

        this.rollback.toDelete.walletId = wallet.walletId;

        const refCreated = await this.createRefUseCase.execute({
            ref: organization._id,
            mode: 'organization',
            type: 'subscription'
        });

        if (refCreated.isFailure) {
            await this.doRollback();
            return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
        }

        const ref = refCreated.getValue()!;

        organization.ref = ref;

        this.rollback.toDelete.refId = ref._id.toString();

        if (user.organization) {
            await this.doRollback();
            return Result.fail(UseCaseError.create('f', 'User already has an organization'));
        }

        user.organization = organization._id;
        organization.user = user._id;

        if (user.parent) {
            organization.manager = user.parent;
        }

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            await this.doRollback();
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            await this.doRollback();
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        const employeeCreated = await this.createEmployeeUseCase.execute({
            contactId: user.contacts[0].toHexString(),
            defaultCashier: true,
            organizationId: organization._id,
            role: 'cashier'
        });

        if (employeeCreated.isFailure) {
            await this.doRollback();
            return Result.fail(UseCaseError.create('a', 'Error upon creating employee'));
        }

        if (req.requestedPacketId) {
            await this.requestPacketUseCase.execute({
                userId: user._id.toString(),
                email: user.email?.toString(),
                packetId: req.requestedPacketId,
                generateDocuments: false
            });
        }

        await this.telegramService.send('organizationCreated', {
            organizationName: organization.name,
            organizationId: organization._id.toString(),
            organizationUserEmail: user.email
        });

        return Result.ok({organizationId: organization._id.toString()});
    }

    private async doRollback(): Promise<void> {
        if (this.rollback.toSave.user) {
            await this.userRepo.deleteById(this.rollback.toSave.user._id.toString());
            const user = new UserModel(this.rollback.toSave.user);

            user.__v = this.rollback.toSave.user.__v;

            console.log(await this.userRepo.save(user));
        }

        if (this.rollback.toDelete.walletId) {
            await this.walletRepo.deleteById(this.rollback.toDelete.walletId);
        }

        if (this.rollback.toDelete.tagIds) {
            await this.tagRepo.deleteByIds(this.rollback.toDelete.tagIds);
        }

        if (this.rollback.toDelete.refId) {
            await this.refRepo.deleteById(this.rollback.toDelete.refId);
        }

        if (this.rollback.toDelete.organizationId) {
            await this.organizationRepo.deleteById(this.rollback.toDelete.organizationId);
        }
    }

    private async getKeyObjects(userId: string, categoryId: string, addressId: string, pictureMediaId: string, mainPictureMediaId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const categoryFound = await this.categoryRepo.findById(categoryId);
        if (categoryFound.isFailure) {
            return Result.fail(categoryFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding category') : UseCaseError.create('j'));
        }

        const category = categoryFound.getValue()!;

        const addressFound = await this.addressRepo.findById(addressId);
        if (addressFound.isFailure) {
            return Result.fail(addressFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding address') : UseCaseError.create('a9'));
        }

        const address = addressFound.getValue()!;

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
                return Result.fail(mainPictureMediaFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding main picture media') : UseCaseError.create('a5', 'Main picture does not exist'));
            }

            mainPictureMedia = mainPictureMediaFound.getValue()!;
        }

        return Result.ok({
            address,
            category,
            mainPictureMedia,
            pictureMedia,
            user
        });
    }
}
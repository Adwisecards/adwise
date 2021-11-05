import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IPurchase } from "../../../../finance/models/Purchase";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../models/User";
import { UserNotificationModel } from "../../../models/UserNotification";
import { IUserNotificationRepo } from "../../../repo/userNotifications/IUserNotificationRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserNotificationValidationService } from "../../../services/userNotificationValidationService/IUserNotificationValidationService";
import { CreateUserNotificationDTO } from "./CreateUserNotificationDTO";
import { createUserNotificationErrors } from "./createUserNotificationErrors";

interface IKeyObjects {
    user: IUser;
    contact?: IContact;
    purchase?: IPurchase;
    organization?: IOrganization;
};

export class CreateUserNotificationUseCase implements IUseCase<CreateUserNotificationDTO.Request, CreateUserNotificationDTO.Response> {
    private userRepo: IUserRepo;
    private contactRepo: IContactRepo;
    private purchaseRepo: IPurchaseRepo;
    private organizationRepo: IOrganizationRepo;
    private userNotificationRepo: IUserNotificationRepo;
    private userNotificationValidationService: IUserNotificationValidationService;

    public errors = createUserNotificationErrors;

    constructor(
        userRepo: IUserRepo,
        contactRepo: IContactRepo,
        purchaseRepo: IPurchaseRepo,
        organizationRepo: IOrganizationRepo,
        userNotificationRepo: IUserNotificationRepo,
        userNotificationValidationService: IUserNotificationValidationService
    ) {
        this.userRepo = userRepo;
        this.contactRepo = contactRepo;
        this.purchaseRepo = purchaseRepo;
        this.organizationRepo = organizationRepo;
        this.userNotificationRepo = userNotificationRepo;
        this.userNotificationValidationService = userNotificationValidationService;
    }

    public async execute(req: CreateUserNotificationDTO.Request): Promise<CreateUserNotificationDTO.Response> {
        const valid = this.userNotificationValidationService.createUserNotificationData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.purchaseId, req.contactId, req.organizationId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            user,
            contact,
            purchase,
            organization
        } = keyObjectsGotten.getValue()!;

        const userNotification = new UserNotificationModel({
            user: user._id,
            contact: contact?._id,
            purchase: purchase?._id,
            organization: organization?._id,

            level: req.level,
            type: req.type
        });

        const userNotificationSaved = await this.userNotificationRepo.save(userNotification);
        if (userNotificationSaved.isFailure) {
            console.log(userNotificationSaved);
            return Result.fail(UseCaseError.create('a', 'Error upon saving user notification'));
        }

        return Result.ok({
            userNotificationId: userNotification._id
        });
    }

    private async getKeyObjects(userId: string, purchaseId?: string, contactId?: string, organizationId?: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ?UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        let contact: IContact | undefined;

        if (contactId) {
            const contactFound = await this.contactRepo.findById(contactId);
            if (contactFound.isFailure) {
                return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding contact') : UseCaseError.create('w'));
            }

            contact = contactFound.getValue()!;
        }

        let purchase: IPurchase | undefined;

        if (purchaseId) {
            const purchaseFound = await this.purchaseRepo.findById(purchaseId);
            if (purchaseFound.isFailure) {
                return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
            }

            purchase = purchaseFound.getValue()!;
        }

        let organization: IOrganization | undefined;

        if (organizationId) {
            const organizationFound = await this.organizationRepo.findById(organizationId);
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            organization = organizationFound.getValue()!;
        }

        return Result.ok({
            user,
            contact,
            purchase,
            organization
        });
    }
}
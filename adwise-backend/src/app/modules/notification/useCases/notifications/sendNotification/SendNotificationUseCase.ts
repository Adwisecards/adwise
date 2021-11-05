import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotificationService } from "../../../../../services/notificationService/INotificationService";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IClientRepo } from "../../../../organizations/repo/clients/IClientRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { NotificationModel } from "../../../models/Notification";
import { IReceiverGroup } from "../../../models/ReceiverGroup";
import { INotificationRepo } from "../../../repo/notifications/INotificationRepo";
import { IReceiverGroupRepo } from "../../../repo/receiverGroups/IReceiverGroupRepo";
import { INotificationValidationService } from "../../../services/notifications/notificationValidationService/INotificationValidationService";
import { GetNotificationSettingsUseCase } from "../../notificationSettings/getNotificationSettings/GetNotificationSettingsUseCase";
import { SendNotificationDTO } from "./SendNotificationDTO";
import { sendNotificationErrors } from "./sendNotificationErrors";

interface IKeyObjects {
    receivers: IUser[];
    user?: IUser;
    organization?: IOrganization;
};

export class SendNotificationUseCase implements IUseCase<SendNotificationDTO.Request, SendNotificationDTO.Response> {
    private userRepo: IUserRepo;
    private clientRepo: IClientRepo;
    private notificationRepo: INotificationRepo;
    private organizationRepo: IOrganizationRepo;
    private receiverGroupRepo: IReceiverGroupRepo;
    private notificationService: INotificationService;
    private notificationValidationService: INotificationValidationService;
    private getNotificationSettingsUseCase: GetNotificationSettingsUseCase;


    public errors = sendNotificationErrors;

    constructor(
        userRepo: IUserRepo,
        clientRepo: IClientRepo,
        notificationRepo: INotificationRepo,
        organizationRepo: IOrganizationRepo,
        receiverGroupRepo: IReceiverGroupRepo,
        notificationService: INotificationService,
        notificationValidationService: INotificationValidationService,
        getNotificationSettingsUseCase: GetNotificationSettingsUseCase
    ) {
        this.userRepo = userRepo;
        this.clientRepo = clientRepo;
        this.notificationRepo = notificationRepo;
        this.organizationRepo = organizationRepo;
        this.receiverGroupRepo = receiverGroupRepo;
        this.notificationService = notificationService;
        this.notificationValidationService = notificationValidationService;
        this.getNotificationSettingsUseCase = getNotificationSettingsUseCase;
    }

    public async execute(req: SendNotificationDTO.Request): Promise<SendNotificationDTO.Response> {
        const valid = this.notificationValidationService.sendNotificationServiceData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        let receiverGroup: IReceiverGroup;

        if (req.receiverGroupId) {
            const receiverGroupFound = await this.receiverGroupRepo.findById(req.receiverGroupId);
            if (receiverGroupFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding receiver group'));
            }
        
            receiverGroup = receiverGroupFound.getValue()!;
        }

        const keyObjectsGotten = await this.getKeyObjects(receiverGroup! ? receiverGroup!.receivers as any : req.receiverIds, req.userId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            organization,
            receivers,
            user
        } = keyObjectsGotten.getValue()!;

        const notification = new NotificationModel({
            type: req.type,
            title: req.title,
            body: req.body,
            data: req.data,
            receiverGroup: receiverGroup! ? receiverGroup!._id : undefined as any,
            receivers: req.receiverIds,
            organization: user?.admin ? undefined : organization?._id
        });

        console.log('sendNotification req', req);
        
        for (const receiver of receivers) {
            const notificationSettingsGotten = await this.getNotificationSettingsUseCase.execute({userId: receiver._id.toString()});
            if (notificationSettingsGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding notification settings gotten'));
            }

            const { notificationSettings } = notificationSettingsGotten.getValue()!;

            let hasRestrictedOrganization = false;

            console.log('\n', 1, '\n');

            if (req.app != 'business') {
                for (const restrictedOrganization of notificationSettings.restrictedOrganizations) {
                    if (receiverGroup! && receiverGroup!.parameters.organizations.find(o => o.toString() == restrictedOrganization.toString())) {
                        hasRestrictedOrganization = true;
                    }

                    if (req.asOrganization && restrictedOrganization.toString() == organization?._id.toString()) {
                        hasRestrictedOrganization = true;
                    }
                }

                console.log('\n', 2, '\n');

                let isClient = true;

                if (req.asOrganization) {
                    console.log('\n', 3, '\n');
                    const clientFound = await this.clientRepo.findByOrganizationAndUser(organization?._id.toString(), receiver._id);
                    console.log(organization?._id, user?._id);
                    if (clientFound.isFailure) {
                        isClient = false;
                    } else {
                        const client = clientFound.getValue()!;

                        if (client.disabled) {
                            isClient = false;
                        }
                    }
                }

                console.log('\n', 4, '\n');

                if (!isClient) {
                    continue;
                }
    
                if (
                    (req.type == 'purchaseCompleted' ||
                    req.type == 'purchaseConfirmed' ||
                    req.type == 'purchaseCreated' ||
                    req.type == 'purchaseShared') &&
                    !notificationSettings.coupon
                ) {
                    continue;
                }
    
                if (
                    (req.type == 'refPurchase') &&
                    !notificationSettings.ref
                ) {
                    continue;
                }
    
                if (
                    (req.type == 'contactRequestAccepted' ||
                    req.type == 'contactRequestCreated') &&
                    !notificationSettings.contact
                ) {
                    continue;
                }
    
                if (
                    (req.type == 'taskCreated') &&
                    !notificationSettings.task
                ) {
                    continue;
                }
    
                if (hasRestrictedOrganization) continue;
            }

            if (!receiver.deviceToken && !receiver.pushToken) continue;

            console.log('receiver', [receiver].map(r => ({id: r._id, pushToken: r.pushToken, deviceToken: r.deviceToken})));

            await this.notificationService.sendNotification(
                req.app || 'cards',
                req.app == 'cards' ? receiver.pushToken : receiver.pushTokenBusiness || receiver.pushToken,
                req.app == 'cards' ?  receiver.deviceToken : receiver.deviceTokenBusiness || receiver.deviceToken,
                req.type,
                req.type == 'common' ? {} : req.values,
                req.data!,
                req.type == 'common' ? {
                    body: notification.body,
                    data: notification.data,
                    title: req.asOrganization ? organization?.name! : notification.title
                } : undefined,
                receiver.language as any
            );
        }

        const notificationSaved = await this.notificationRepo.save(notification);

        if (notificationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving notification'));
        }

        return Result.ok({
            notificationId: notification._id
        });
    }

    private async getKeyObjects(receiverIds: string[], userId?: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const receiversFound = await this.userRepo.findByIds(receiverIds);
        if (receiversFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding receivers'));
        }

        const receivers = receiversFound.getValue()!;

        let user: IUser | undefined;

        if (userId) {
            const userFound = await this.userRepo.findById(userId);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding user") : UseCaseError.create('m'));
            }

            user = userFound.getValue()!;
        }

        let organization: IOrganization | undefined;
        
        if (user && user.organization) {
            const organizationFound = await this.organizationRepo.findById(user.organization.toString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            organization = organizationFound.getValue()!;
        } 

        return Result.ok({
            receivers,
            user,
            organization
        });
    }
}
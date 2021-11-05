import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { logger } from "../../../../../services/logger";
import { ITelegramService } from "../../../../../services/telegramService/ITelegramService";
import { IClient } from "../../../../organizations/models/Client";
import { IEmployee } from "../../../../organizations/models/Employee";
import { IClientRepo } from "../../../../organizations/repo/clients/IClientRepo";
import { IEmployeeRepo } from "../../../../organizations/repo/employees/IEmployeeRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ISubscription, SubscriptionModel } from "../../../models/Subscription";
import { ISubscriptionRepo } from "../../../repo/subscriptions/ISubscriptionRepo";
import { ISubscriptionValidationService } from "../../../services/subscriptions/subscriptionValidationService/ISubscriptionValidationService";
import { CreateSubscriptionCreatedRecordUseCase } from "../../subscriptionCreatedRecords/createSubscriptionCreatedRecord/CreateSubscriptionCreatedRecordUseCase";
import { CreateSubscriptionDTO } from "./CreateSubscriptionDTO";
import { createSubscriptionErrors } from "./createSubscriptionErrors";

export class CreateSubscriptionUseCase implements IUseCase<CreateSubscriptionDTO.Request, CreateSubscriptionDTO.Response> {
    private subscriptionRepo: ISubscriptionRepo;
    private organizationRepo: IOrganizationRepo;
    private userRepo: IUserRepo;
    private subscriptionValidationService: ISubscriptionValidationService;
    private employeeRepo: IEmployeeRepo;
    private clientRepo: IClientRepo;
    private createSubscriptionCreatedRecord: CreateSubscriptionCreatedRecordUseCase;
    private telegramService: ITelegramService;

    public errors = createSubscriptionErrors;

    constructor(
        subscriptionRepo: ISubscriptionRepo, 
        organizationRepo: IOrganizationRepo, 
        userRepo: IUserRepo, 
        subscriptionValidationService: ISubscriptionValidationService, 
        employeeRepo: IEmployeeRepo, 
        clientRepo: IClientRepo, 
        createSubscriptionCreatedRecord: CreateSubscriptionCreatedRecordUseCase,
        telegramService: ITelegramService
    ) {
        this.subscriptionRepo = subscriptionRepo;
        this.organizationRepo = organizationRepo;
        this.userRepo = userRepo;
        this.subscriptionValidationService = subscriptionValidationService;
        this.employeeRepo = employeeRepo;
        this.clientRepo = clientRepo;
        this.createSubscriptionCreatedRecord = createSubscriptionCreatedRecord;
        this.telegramService = telegramService;
    }

    public async execute(req: CreateSubscriptionDTO.Request): Promise<CreateSubscriptionDTO.Response> {
        const valid = this.subscriptionValidationService.createSubscriptionData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const subscriptionFound = await this.subscriptionRepo.findByUserAndOrganization(req.userId, req.organizationId);
        if (subscriptionFound.isSuccess) {
            return Result.fail(UseCaseError.create('f'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let parent: ISubscription;
        if (req.invitation) {
            const parentSubscriptionFound = await this.subscriptionRepo.findById(req.invitation.subscription.toString());
            if (parentSubscriptionFound.isFailure) {
                return Result.fail(parentSubscriptionFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('n'));
            }

            parent = parentSubscriptionFound.getValue()!;
        }

        let userParent: IUser | undefined;
        if (parent!) {
            const userParentFound = await this.userRepo.findById(parent!.subscriber.toString());
            if (userParentFound.isFailure) {
                return Result.fail(userParentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user parent') : UseCaseError.create('m', 'User parent does not exist'));
            }

            userParent = userParentFound.getValue()!;
        }

        let employee: IEmployee;
        let client: IClient;
        if (parent!) {
            const employeeFound = await this.employeeRepo.findByOrganizationAndUser(organization._id, parent!.subscriber.toHexString());
            if (employeeFound.isSuccess) {
                employee = employeeFound.getValue()!;
            }

            const clientFound = await this.clientRepo.findByOrganizationAndUser(organization._id, parent!.subscriber.toHexString());
            if (clientFound.isSuccess) {
                client = clientFound.getValue()!;
            }
        }

        const subscription: ISubscription = new SubscriptionModel(<ISubscription>{
            parent: parent! ? parent!._id : undefined,
            subscriber: user._id,
            organization: organization._id,
            level: parent! ? parent!.level + 1 : 1
        });

        subscription.root = parent! ? parent!.root : subscription._id;

        if (employee!) {
            if (subscription.level == 2) {
                employee!.refsFirstLevel++;
            } else {
                employee!.refsOtherLevels++;
            }
        }

        if (client!) {
            client!.refCount++;
        }

        if (subscription.level > 21) {
            subscription.parent = undefined as any;
            subscription.root = subscription._id;
            parent = undefined as any;
            subscription.level = 1;
        }
        
        if (parent!) {
            parent!.children.push(subscription._id);
            const parentSaved = await this.subscriptionRepo.save(parent!);
            if (parentSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving parent subscription'));
            }
        }

        const subscriptionSaved = await this.subscriptionRepo.save(subscription);
        if (subscriptionSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving subscription'));
        }

        if (employee!) {
            await this.employeeRepo.save(employee!);
        }

        if (client!) {
            await this.clientRepo.save(client!);
        }

        logger.infoWithMeta('Subscription created', {subscription: subscription.toObject(), parent: parent! ? parent!.toObject() : null});

        if (parent!) {
            const parentUserFound = await this.userRepo.findById(parent!.subscriber.toHexString());
            if (parentUserFound.isSuccess) {
                const parentUser = parentUserFound.getValue()!;
                // parentUser.logs.unshift({
                //     ref: subscription._id,
                //     type: 'refSubscribed',
                //     timestamp: new Date()
                // });

                await this.userRepo.save(parentUser);
            }
        }

        await this.createSubscriptionCreatedRecord.execute({
            subscription: subscription,
            invitation: req.invitation,
            organization: organization,
            invitee: req.userId,
            inviter: parent! ? parent!.subscriber.toString() : undefined as any,
        });

        await this.telegramService.send('subscriptionCreated', {
            organizationName: organization?.name,
            invitationType: req.invitation?.invitationType || '-',
            subscriber: (`${user.firstName} ${user.lastName}`).trim() || '-',
            inviter: userParent ? (`${userParent.firstName} ${userParent.lastName}`).trim() : '-',
            level: subscription.level?.toString(),
            date: new Date().toISOString()
        });

        return Result.ok({subscriptionId: subscription._id});
    }
}
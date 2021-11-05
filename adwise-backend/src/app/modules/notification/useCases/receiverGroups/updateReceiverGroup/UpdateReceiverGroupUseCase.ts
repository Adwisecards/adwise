import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { IClientRepo } from "../../../../organizations/repo/clients/IClientRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IReceiverGroup } from "../../../models/ReceiverGroup";
import { IReceiverGroupRepo } from "../../../repo/receiverGroups/IReceiverGroupRepo";
import { GetNotificationSettingsUseCase } from "../../notificationSettings/getNotificationSettings/GetNotificationSettingsUseCase";
import { UpdateReceiverGroupDTO } from "./UpdateReceiverGroupDTO";
import { updateReceiverGroupErrors } from "./updateReceiverGroupErrors";

interface IKeyObjects {
    receiverGroup: IReceiverGroup;
    users: IUser[];
};

export class UpdateReceiverGroupUseCase implements IUseCase<UpdateReceiverGroupDTO.Request, UpdateReceiverGroupDTO.Response> {
    private userRepo: IUserRepo;
    private clientRepo: IClientRepo;
    private purchaseRepo: IPurchaseRepo;
    private receiverGroupRepo: IReceiverGroupRepo;
    private getNotificationSettingsUseCase: GetNotificationSettingsUseCase;

    public errors = updateReceiverGroupErrors;

    constructor(
        userRepo: IUserRepo,
        clientRepo: IClientRepo,
        purchaseRepo: IPurchaseRepo,
        receiverGroupRepo: IReceiverGroupRepo,
        getNotificationSettingsUseCase: GetNotificationSettingsUseCase
    ) {
        this.userRepo = userRepo;
        this.clientRepo = clientRepo;
        this.purchaseRepo = purchaseRepo;
        this.receiverGroupRepo = receiverGroupRepo;
        this.getNotificationSettingsUseCase = getNotificationSettingsUseCase;
    }

    public async execute(req: UpdateReceiverGroupDTO.Request): Promise<UpdateReceiverGroupDTO.Response> {
        if (!Types.ObjectId.isValid(req.receiverGroupId)) {
            return Result.fail(UseCaseError.create('c', 'receiverGroupId is not valid'));
        }
        
        const keyObjectsGotten = await this.getKeyObjects(req.receiverGroupId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            receiverGroup,
            users
        } = keyObjectsGotten.getValue()!

        let receivers: string[] = [];

        for (const user of users) {
            if (!user.deviceToken && !user.pushToken) {
                continue;
            }

            let userAge: number = ((new Date().getTime() - user.dob?.getTime()) / 3.154e+10) || 0;

            if (receiverGroup.parameters.os && receiverGroup.parameters.os != user.platform) {
                continue;
            }

            if (receiverGroup.parameters.gender && receiverGroup.parameters.gender != user.gender) {
                continue;
            }

            if (receiverGroup.parameters.ageFrom && receiverGroup.parameters.ageFrom > userAge) {
                continue;
            }

            if (receiverGroup.parameters.ageTo && receiverGroup.parameters.ageTo < userAge) {
                continue;
            }

            if (receiverGroup.parameters.hasPurchase != undefined) {
                const purchasesFound = await this.purchaseRepo.findByUser(user._id.toString(), 1, 1, false);
                if (purchasesFound.isFailure && receiverGroup.parameters.hasPurchase) {
                    continue;
                }

                const purchases = purchasesFound.getValue()!;

                if (!purchases.length && receiverGroup.parameters.hasPurchase) {
                    continue;
                }
            }

            let isClient = true;

            if (receiverGroup.parameters.organizations && receiverGroup.parameters.organizations.length) {
                for (const organizationId of receiverGroup.parameters.organizations) {
                    const clientFound = await this.clientRepo.findByOrganizationAndUser(organizationId.toString(), user._id.toString());
                    if (clientFound.isFailure) {
                        isClient = false;
                    } else {
                        const client = clientFound.getValue()!;

                        if (client.disabled) {
                            isClient = false;
                        }
                    }
                }
            }

            if (!isClient) {
                continue;
            }

            console.log(user._id);

            receivers.push(user._id.toString());
        }

        receiverGroup.receivers = receivers as any;

        const receiverGroupSaved = await this.receiverGroupRepo.save(receiverGroup);
        if (receiverGroupSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving receiver group'));
        }

        return Result.ok({
            receiverGroupId: req.receiverGroupId
        });
    }

    private async getKeyObjects(receiverGroupId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const receiverGroupFound = await this.receiverGroupRepo.findById(receiverGroupId);
        if (receiverGroupFound.isFailure) {
            return Result.fail(receiverGroupFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon receiver group') : UseCaseError.create('8'));
        }

        const receiverGroup = receiverGroupFound.getValue()!;

        let users: IUser[] = [];

        if (receiverGroup.wantedReceivers?.length) {
            const usersFound = await this.userRepo.findByIds(receiverGroup.wantedReceivers.map(r => r.toString()));
            if (usersFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding users'));
            }

            users = usersFound.getValue()!;
        } else {
            const usersFound = await this.userRepo.getAll();
            if (usersFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding users'));
            }

            users = usersFound.getValue()!;
        }

        return Result.ok({
            receiverGroup,
            users
        });
    }
}
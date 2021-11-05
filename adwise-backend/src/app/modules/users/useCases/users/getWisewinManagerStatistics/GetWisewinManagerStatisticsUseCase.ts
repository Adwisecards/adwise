import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWallet } from "../../../../finance/models/Wallet";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { GetLevelSubscriptionsDTO } from "../../../../finance/useCases/subscriptions/getLevelSubscriptions/GetLevelSubscriptionsDTO";
import { GetLevelSubscriptionsUseCase } from "../../../../finance/useCases/subscriptions/getLevelSubscriptions/GetLevelSubscriptionsUseCase";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { GetUserFinancialStatisticsUseCase } from "../getUserFinancialStatistics/GetUserFinancialStatisticsUseCase";
import { GetWisewinStatisticsUseCase } from "../getWisewinStatistics/GetWisewinStatisticsUseCase";
import { GetWisewinManagerStatisticsDTO } from "./GetWisewinManagerStatisticsDTO";
import { getWisewinManagerStatisticsErrors } from "./getWisewinManagerStatisticsErrors";

export class GetWisewinManagerStatisticsUseCase implements IUseCase<GetWisewinManagerStatisticsDTO.Request, GetWisewinManagerStatisticsDTO.Response> {
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private getUserFinancialStatisticsUseCase: GetUserFinancialStatisticsUseCase;
    private getWisewinStatisticsUseCase: GetWisewinStatisticsUseCase;
    private getLevelSubscriptionsUseCase: GetLevelSubscriptionsUseCase;
    private subscriptionRepo: ISubscriptionRepo;

    public errors = [
        ...getWisewinManagerStatisticsErrors
    ];

    constructor(userRepo: IUserRepo, organizationRepo: IOrganizationRepo, getUserFinancialStatisticsUseCase: GetUserFinancialStatisticsUseCase, getLevelSubscriptionsUseCase: GetLevelSubscriptionsUseCase, getWisewinStatisticsUseCase: GetWisewinStatisticsUseCase, subscriptionRepo: ISubscriptionRepo) {
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.getUserFinancialStatisticsUseCase = getUserFinancialStatisticsUseCase;
        this.getLevelSubscriptionsUseCase = getLevelSubscriptionsUseCase;
        this.getWisewinStatisticsUseCase = getWisewinStatisticsUseCase;
        this.subscriptionRepo = subscriptionRepo;
    }

    public async execute(req: GetWisewinManagerStatisticsDTO.Request): Promise<GetWisewinManagerStatisticsDTO.Response> {
        if (!req.wisewinId) {
            return Result.fail(UseCaseError.create('c', 'wisewinId is not valid'));
        }

        const userFound = await this.userRepo.findByWinwiseId(req.wisewinId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = await userFound.getValue()!.populate('wallet').execPopulate();
        let organization: IOrganization;
        if (user.organization) {
            const organizationFound = await this.organizationRepo.findById(user.organization.toHexString());
            if (organizationFound.isSuccess) {
                console.log(organizationFound);
                organization = await organizationFound.getValue()!.populate('wallet').execPopulate();
            }
        }

        const managerOrganizationsFound = await this.organizationRepo.findByManager(user._id);
        if (managerOrganizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding manager organizaions'));
        }

        const managerOrganizations = managerOrganizationsFound.getValue()!;

        const userFinancialStatisticsGotten = await this.getUserFinancialStatisticsUseCase.execute({
            userId: user._id,
            optimized: false
        });
        if (userFinancialStatisticsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting user financial statistics'));
        }

        const userFinancialStatistics = userFinancialStatisticsGotten.getValue()!;

        const wisewinStatisticsGotten = await this.getWisewinStatisticsUseCase.execute({
            userId: user._id
        });
        if (wisewinStatisticsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting wisewin statistics'));
        }

        const wisewinStatistics = wisewinStatisticsGotten.getValue()!;
        
        let firstRefs = 0;
        let otherRefs = 0;

        const subscriptionsFound = await this.subscriptionRepo.findSubscriptionsByUser(user._id);
        if (subscriptionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding subscriptions'));
        }

        const subscriptions = subscriptionsFound.getValue()!;

        for (const subscription of subscriptions) {
            const levelSubscriptionsFound = await this.getLevelSubscriptionsUseCase.execute({
                organizationId: subscription.organization.toHexString(),
                userId: user._id
            });
            if (levelSubscriptionsFound.isSuccess) {
                const levelSubscriptions = levelSubscriptionsFound.getValue()!;
                firstRefs += levelSubscriptions.subscriptions.find(s => s.level == 1)!.items!.length;
                otherRefs += levelSubscriptions.subscriptions.filter(s => s.level > 1).reduce((count: number, s) => count + s.items!.length, 0);
            }
        }

        return Result.ok({
            bonusPoints: userFinancialStatistics.bonusSum,
            purchaseSum: userFinancialStatistics.purchaseSum,
            organizationPacket: organization! ? organization!.packet : null as any,
            marketingSum: userFinancialStatistics.marketingSum,
            organizationBalance: organization! ? (<IWallet>(<any>organization!.wallet)).points : 0,
            userBalance: (<IWallet>(<any>user.wallet)).points + (<IWallet>(<any>user.wallet)).bonusPoints + (<IWallet>(<any>user.wallet)).cashbackPoints, // TEMP
            managerOrganizationCount: managerOrganizations.length,
            firstRefs: firstRefs!,
            otherRefs: otherRefs!,
            remainingPackets: wisewinStatistics.remainingPackets,
            refCode: user.ref.code
        });
    }
}
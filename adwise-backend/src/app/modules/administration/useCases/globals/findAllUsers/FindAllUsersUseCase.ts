
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWisewinService, IWisewinUser } from "../../../../../services/wisewinService/IWisewinService";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { IContact } from "../../../../contacts/models/Contact";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { GetUserFinancialStatisticsUseCase } from "../../../../users/useCases/userFinancialStatistics/getUserFinancialStatistics/GetUserFinancialStatisticsUseCase";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllUsersDTO } from "./FindAllUsersDTO";

export class FindAllUsersUseCase implements IUseCase<FindAllUsersDTO.Request, FindAllUsersDTO.Response> {
    private userRepo: IUserRepo;
    private administrationValidationService: IAdministrationValidationService;
    private wisewinService: IWisewinService;
    private getUserFinancialStatisticsUseCase: GetUserFinancialStatisticsUseCase;
    private xlsxService: IXlsxService;

    public errors: UseCaseError[] = [

    ];

    constructor(
        administrationValidationService: IAdministrationValidationService, 
        userRepo: IUserRepo, 
        wisewinService: IWisewinService,
        getUserFinancialStatisticsUseCase: GetUserFinancialStatisticsUseCase,
        xlsxService: IXlsxService
    ) {
        this.userRepo = userRepo;
        this.administrationValidationService = administrationValidationService;
        this.wisewinService = wisewinService;
        this.getUserFinancialStatisticsUseCase = getUserFinancialStatisticsUseCase;
        this.xlsxService = xlsxService;
    }

    public async execute(req: FindAllUsersDTO.Request): Promise<FindAllUsersDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber' || key == 'export') continue;

            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        let users: IUser[] = [];

        if (req.export) {
            const usersFound = await this.userRepo.search(parameterNames, parameterValues, req.sortBy, req.order, 9999, 1, 'wallet organization parent contacts contacts.organization');
            if (usersFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding users'));
            }

            users = usersFound.getValue()!;
        } else {
            const usersFound = await this.userRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'wallet organization parent contacts contacts.organization');
            if (usersFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding users'));
            }

            users = usersFound.getValue()!;
        }

        const wisewinIds = users.filter(u => u.wisewinId).map(u => u.wisewinId);

        const wisewinUsersFound = await this.wisewinService.getUsersById(wisewinIds);
        if (wisewinUsersFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting wisewin users'));
        }

        const wisewinUsers = wisewinUsersFound.getValue()!;

        const usersWithStatsAndWisewinInfo: any[] = [];

        for (const user of users) {
            let userWithStatsAndWisewinInfo: any = user.toObject();
            
            const wisewinUser = (<any>wisewinUsers)[user.wisewinId.toString()] as IWisewinUser;

            if (wisewinUser) {
                userWithStatsAndWisewinInfo.wisewinInfo = {
                    packet: wisewinUser.tariffTitle,
                    remainingPackets: wisewinUser.packageRewardLimit - user.organizationPacketsSold,
                    remainingStartPackets: wisewinUser.startPackagesLeft - user.startPacketsSold || 0
                }
            }

            const userFinancialStatisticsGotten = await this.getUserFinancialStatisticsUseCase.execute({
                userId: user._id.toString(),
                noUpdate: true
            });

            if (userFinancialStatisticsGotten.isSuccess) {
                const userFinancialStatistics = userFinancialStatisticsGotten.getValue()!;

                userWithStatsAndWisewinInfo.stats = userFinancialStatistics;
            }

            usersWithStatsAndWisewinInfo.push(userWithStatsAndWisewinInfo);
        }

        if (req.export) {
            const xlsxGenerated = await this.xlsxService.convert(usersWithStatsAndWisewinInfo.map((u: FindAllUsersDTO.IUserWithStatsAndWisewinInfo) => {
                const employeeContact = (<any>u.contacts).find((c: IContact) => {
                    return c.type == 'work';
                });

                return {
                    '??????????????': u.lastName,
                    '??????': u.firstName,
                    '????????????????': u.email ? 'CRM' : 'APP',
                    '??????????????': (<any>u.parent)?._id.toString(),
                    'Wise Win ID': u.wisewinId,
                    'Wise Win ????????????': u.wisewinInfo?.remainingStartPackets,
                    '????????????': (<any>u.wallet).points + '???',
                    '???????????? ??????????????': (<any>u.wallet).bonusPoints + '???',
                    '???????????? ????????????': (<any>u.wallet).cashbackPoints + '???',
                    '?? ????????????????????': (<any>u.wallet).frozenPointsSum + '???',
                    '?????????????????? ???????????? ??????????????': u.stats.usedPointsSum + '???',
                    '?????????????????? ?????????? ???????????? ???????????? ????????????????????????': u.stats.withdrawalSum + '???',
                    '?????????? ?????????? ?????????????????? ???????????????????????????? ???? ?????? ??????????': u.stats.bonusSum + '???',
                    '??????-???? ?????????????????? ????????????????': u.wisewinInfo?.remainingPackets,
                    '?????????? Wise Win': u.wisewinInfo?.packet,
                    '?????? ????????????????????????': u.ref.code,
                    'ID ???????????????????? ??????????': u.paymentCardId,
                    'ID ????????????????': (<any>u.wallet)._id.toString(),
                    'Email': u.email,
                    '??????????????': u.phone,
                    '??????????????????????': (<any>u.organization)?.name,
                    '???????????? ?? ??????????????????????': employeeContact?.organization?.name,
                    '?????? ?????????????? ????????????': u.admin ? '??????????????????????????' : (u.adminGuest ? '??????????' : '????????????????????????')
                };
            }));

            if (xlsxGenerated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
            }

            const xlsx = xlsxGenerated.getValue()!;

            return Result.ok({users: xlsx as any, count: 0});
        }

        const countFound = await this.userRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({users: usersWithStatsAndWisewinInfo, count});
    }
}
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICurrencyService } from "../../../../../services/currencyService/ICurrencyService";
import { IWisewinService } from "../../../../../services/wisewinService/IWisewinService";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { IPacketSoldRecord } from "../../../../finance/models/PacketSoldRecord";
import { IPacketSoldRecordRepo } from "../../../../finance/repo/packetSoldRecords/IPacketSoldRecordRepo";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { IPacketRepo } from "../../../../organizations/repo/packets/IPacketRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllPacketsSoldDTO } from "./FindAllPacketsSoldDTO";
import { findAllPacketsSoldErrors } from "./findAllPacketsSoldErrors";
import moment from 'moment';

export class FindAllPacketsSoldUseCase implements IUseCase<FindAllPacketsSoldDTO.Request, FindAllPacketsSoldDTO.Response> {
    private userRepo: IUserRepo;
    private xlsxService: IXlsxService;
    private transactionRepo: ITransactionRepo;
    private administrationValidationService: IAdministrationValidationService;
    private packetRepo: IPacketRepo;
    private walletRepo: IWalletRepo;
    private currencyService: ICurrencyService;
    private wisewinService: IWisewinService;
    private packetSoldRecordRepo: IPacketSoldRecordRepo;

    public errors = [
        ...findAllPacketsSoldErrors
    ];

    constructor(
        userRepo: IUserRepo,
        xlsxService: IXlsxService, 
        transactionRepo: ITransactionRepo, 
        administrationValidationService: IAdministrationValidationService, 
        packetRepo: IPacketRepo, 
        walletRepo: IWalletRepo, 
        currencyService: ICurrencyService, 
        wisewinService: IWisewinService, 
        packetSoldRecordRepo: IPacketSoldRecordRepo
    ) {
        this.userRepo = userRepo;
        this.xlsxService = xlsxService;
        this.transactionRepo = transactionRepo;
        this.administrationValidationService = administrationValidationService;
        this.packetRepo = packetRepo;
        this.walletRepo = walletRepo;
        this.currencyService = currencyService;
        this.wisewinService = wisewinService;
        this.packetSoldRecordRepo = packetSoldRecordRepo;
    }

    public async execute(req: FindAllPacketsSoldDTO.Request): Promise<FindAllPacketsSoldDTO.Response> {
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

        let packetSoldRecords: IPacketSoldRecord[] = [];
        
        if (req.export) {
            const packetSoldRecordsFound = await this.packetSoldRecordRepo.search(parameterNames, parameterValues, req.sortBy, req.order, 10000, req.pageNumber);
            if (packetSoldRecordsFound.isFailure) {
                console.log(packetSoldRecordsFound.getError()!);
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }

            packetSoldRecords = packetSoldRecordsFound.getValue()!;
        } else {
            const packetSoldRecordsFound = await this.packetSoldRecordRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber);
            if (packetSoldRecordsFound.isFailure) {
                console.log(packetSoldRecordsFound.getError()!);
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }

            packetSoldRecords = packetSoldRecordsFound.getValue()!;
        }

        if (req.export) {
            const xlsxGenerated = this.xlsxService.convert(packetSoldRecords.map(p => {
                const date = moment(p.timestamp).format("DD.MM.YYYY / HH:mm");
                const managerName = `${p.manager?.lastName ? p.manager?.lastName + ' ' : ''}${p.manager?.firstName}`;
                return {
                    'Дата оплаты': date,
                    'Фио менеджера': managerName,
                    'Организация': p.organization.name,
                    'Тариф': p.packet.name,
                    'Сумма тарифа': p.packet.price.toFixed(2) + '₽',
                    'Вознаграждение': p.packet.managerReward.toFixed(2) + '₽',
                    'Основание': ':'+p.reason
                };
            }));

            if (xlsxGenerated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
            }

            const xlsx = xlsxGenerated.getValue()!;

            return Result.ok({count: -1, packets: xlsx as any});
        }

        const countFound = await this.packetSoldRecordRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({packets: packetSoldRecords, count});
    }

    public async execute2(req: FindAllPacketsSoldDTO.Request): Promise<FindAllPacketsSoldDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber') continue;

            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        parameterNames.push('type');
        parameterValues.push('packet');

        const transactionsFound = await this.transactionRepo.findByType('packet', req.pageSize, req.pageNumber);
        if (transactionsFound.isFailure) {
            console.log(transactionsFound.getError()!);
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!;

        const packetsFound = await this.packetRepo.getAll()!;
        if (packetsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting packets'));
        }

        const packets = packetsFound.getValue()!;
        
        for (const transaction of transactions) {
            const managerFound = await this.userRepo.findByWallet(transaction.to.toString());
            if (managerFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding manager'))
            }

            const manager = managerFound.getValue()!;

            const wisewinManagerFound = await this.wisewinService.getUser(manager.wisewinId);
            if (wisewinManagerFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting wisewin manager'));
            }

            const wisewinManager = wisewinManagerFound.getValue()!;

            const walletFound = await this.walletRepo.findById(transaction.to.toString());
            if (walletFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding wallet'));
            }

            const wallet = walletFound.getValue()!;

            const packet = packets.sort((a, b) => a > b ? 1 : -1).find(async p => {
                let managerReward = p.managerReward;
                let packetPrice = p.price;

                if (p.currency != wallet.currency) {
                    const exchangeMade = await this.currencyService.exchange(p.currency, wallet.currency, transaction.timestamp);
                    if (exchangeMade.isFailure) {
                        return Result.fail(UseCaseError.create('a', `Error in the process of exchange of ${p.currency} and ${wallet.currency}`));
                    }

                    const exchange = exchangeMade.getValue()!;
                    managerReward *= exchange;

                    const exchange2Made = await this.currencyService.exchange(p.currency, wallet.currency, transaction.timestamp);
                    if (exchange2Made.isFailure) {
                        return Result.fail(UseCaseError.create('a', `Error in the process of exchange of ${p.currency} and ${wallet.currency}`));
                    }

                    const exchange2 = exchange2Made.getValue()!;
                    packetPrice *= exchange2;
                }

                console.log(managerReward, packetPrice, p.price, transaction.sum.toFixed(2))

                if (wisewinManager.packageRewardLimit) {
                    return managerReward-100 <= transaction.sum && managerReward+100 >= transaction.sum;
                }

                return (packetPrice * (wisewinManager.packageReferrerPercent / 100))-10  <= transaction.sum && packetPrice * (wisewinManager.packageReferrerPercent / 100) >= transaction.sum;
            });

            if (!packet) {
                return Result.fail(UseCaseError.create('a', 'Packet does not exist'));
            }

        }

        return Result.ok({packets: [], count: -1});
    }
}
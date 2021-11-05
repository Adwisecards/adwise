import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IBackgroundService } from "../../../../../services/backgroundService/IBackgroundService";
import { ICurrencyService } from "../../../../../services/currencyService/ICurrencyService";
import { IWisewinService, IWisewinUser } from "../../../../../services/wisewinService/IWisewinService";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { CreateTransactionUseCase } from "../../../../finance/useCases/transactions/createTransaction/CreateTransactionUseCase";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { DistributePointsFromPacketUseCase } from "../distributePointsFromPacket/DistributePointsFromPacketUseCase";
import { AddPacketToOrganizationDTO } from "./AddPacketToOrganizationDTO";
import { addPacketToOrganizationErrors } from "./addPacketToOrganizationErrors";
import {v4} from 'uuid';
import { CreatePacketSoldRecordUseCase } from "../../../../finance/useCases/packetSoldRecords/createPacketSoldRecord/CreatePacketSoldRecordUseCase";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IPDFService } from "../../../../../services/pdfService/IPDFService";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { IOrganization } from "../../../models/Organization";
import { IPacket, PacketModel } from "../../../models/Packet";
import { IUser } from "../../../../users/models/User";
import { IWallet } from "../../../../finance/models/Wallet";
import { IGlobal } from "../../../../administration/models/Global";
import { IPacketValidationService } from "../../../services/packets/packetValidationService/IPacketValidationService";
import { GenerateOrganizationDocumentUseCase } from "../../../../legal/useCases/organizationDocuments/generateOrganizationDocument/GenerateOrganizationDocumentUseCase";
import { ILegal } from "../../../../legal/models/Legal";
import { ILegalRepo } from "../../../../legal/repo/legal/ILegalRepo";

interface IKeyObjects {
    packet: IPacket;
    organization: IOrganization;
    global: IGlobal;
    userManager?: IUser;
    legal?: ILegal;
};

export class AddPacketToOrganizationUseCase implements IUseCase<AddPacketToOrganizationDTO.Request, AddPacketToOrganizationDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private packetRepo: IPacketRepo;
    private walletRepo: IWalletRepo;
    private createTransactionUseCase: CreateTransactionUseCase;
    private wisewinService: IWisewinService;
    private userRepo: IUserRepo;
    private globalRepo: IGlobalRepo;
    private distributePointsFromPacketUseCase: DistributePointsFromPacketUseCase;
    private backgroundService: IBackgroundService;
    private createPacketSoldUseCase: CreatePacketSoldRecordUseCase;
    private generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase;
    private packetValidationService: IPacketValidationService;
    private legalRepo: ILegalRepo;

    public errors: UseCaseError[] = addPacketToOrganizationErrors;

    constructor(
        packetRepo: IPacketRepo, 
        organizationRepo: IOrganizationRepo, 
        walletRepo: IWalletRepo, 
        createTransactionUseCase: CreateTransactionUseCase, 
        wisewinService: IWisewinService, 
        userRepo: IUserRepo, 
        globalRepo: IGlobalRepo, 
        distributePointsFromPacketUseCase: DistributePointsFromPacketUseCase, 
        backgroundService: IBackgroundService, 
        createPacketSoldUseCase: CreatePacketSoldRecordUseCase,
        generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase,
        packetValidationService: IPacketValidationService,
        legalRepo: ILegalRepo
    ) {
        this.packetRepo = packetRepo;
        this.organizationRepo = organizationRepo;
        this.walletRepo = walletRepo;
        this.createTransactionUseCase = createTransactionUseCase;
        this.wisewinService = wisewinService;
        this.userRepo = userRepo;
        this.globalRepo = globalRepo;
        this.distributePointsFromPacketUseCase = distributePointsFromPacketUseCase;
        this.backgroundService = backgroundService;
        this.createPacketSoldUseCase = createPacketSoldUseCase;
        this.generateOrganizationDocumentUseCase = generateOrganizationDocumentUseCase;
        this.packetValidationService = packetValidationService;
        this.legalRepo = legalRepo;
    }

    public async execute(req: AddPacketToOrganizationDTO.Request): Promise<AddPacketToOrganizationDTO.Response> {
        const valid = this.packetValidationService.addPacketToOrganizationData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.packetId, req.customPacket, req.organizationId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            global,
            organization,
            packet,
            userManager,
            legal
        } = keyObjectsGotten.getValue()!;

        if (!legal) {
            return Result.fail(UseCaseError.create('c', 'Organization has no legal'));
        }

        if (packet.disabled) {
            return Result.fail(UseCaseError.create('c', 'Packet is disabled'));
        }

        let wisewinUser: IWisewinUser | undefined;

        if (userManager) {
            const wisewinUserFound = await this.wisewinService.getUser(userManager.wisewinId);
            if (wisewinUserFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding wisewin user'));
            }

            wisewinUser = wisewinUserFound.getValue()!;
        }

        const packetSoldCreated = await this.createPacketSoldUseCase.execute({
            date: req.date as any || new Date(),
            manager: userManager,
            organization: organization,
            packet: packet,
            reason: req.reason
        });

        if (packetSoldCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating packet sold record'));
        }

        const { packetSoldRecordId } = packetSoldCreated.getValue()!;

        let context = packetSoldRecordId;

        console.log('\n\n\n', context, '\n\n\n');

        const managersRewarded = await this.rewardManagers(userManager, wisewinUser, packet, context);
        if (managersRewarded.isFailure) {
            return Result.fail(managersRewarded.getError());
        }

        await this.generateOrganizationDocumentUseCase.execute({
            organizationId: organization._id.toString(),
            type: 'packetPaymentAct',
            userId: organization.user.toString()
        });

        return Result.ok({organizationId: req.organizationId, packetId: packet._id.toString()});
    }

    private async rewardManagers(userManager: IUser | undefined, wisewinUser: IWisewinUser | undefined, packet: IPacket, context: string): Promise<Result<true | null, UseCaseError | null>> {
        let managerPoints = 0;
        if (userManager && wisewinUser) {
            if (packet.wisewinOption) {
                if (userManager.startPacketsSold < wisewinUser.startPackagesLeft) {    
                    managerPoints = packet.managerReward;
                            
                    if (!userManager.startPacketsSold) {
                        userManager.startPacketsSold = 0;
                    }
                    
                    userManager.startPacketsSold++;
                } else {                
                    managerPoints = packet.price * (wisewinUser.packageReferrerPercent / 100);
                }
            } else {
                if (userManager.organizationPacketsSold < wisewinUser.packageRewardLimit) {    
                    console.log('\n\n\n\n\n\n\n\nuserManager.organizationPacketsSold < wisewinUser.packageRewardLimit', userManager.organizationPacketsSold, wisewinUser.packageRewardLimit);
                    managerPoints = packet.managerReward;
                            
                    if (!userManager.organizationPacketsSold) {
                        userManager.organizationPacketsSold = 0;
                    }
                    
                    userManager.organizationPacketsSold++;
                } else {            
                    console.log('\n\n\n\n\n\n\n\nuserManager.organizationPacketsSold > wisewinUser.packageRewardLimit', userManager.organizationPacketsSold, wisewinUser.packageRewardLimit);    
                    managerPoints = packet.price * (wisewinUser.packageReferrerPercent / 100);
                    console.log('\n\n\n\n\n\n\n\n', managerPoints);    
                }
            }
    
            await this.createTransactionUseCase.execute({
                currency: packet.currency,
                from: undefined as any,
                to: userManager.wallet.toString(),
                type: 'packet',
                sum: managerPoints,
                context: context,
                frozen: false
            });

            const userManagerSaved = await this.userRepo.save(userManager);
            if (userManagerSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving manager'));
            }
        } else {
            await this.createTransactionUseCase.execute({
                currency: packet.currency,
                from: undefined as any,
                to: undefined as any,
                type: 'packet',
                sum: managerPoints,
                context: context,
                frozen: false
            });
        }

        if (userManager?.parent) {
            this.backgroundService.runInBackground(() => {
                this.distributePointsFromPacketUseCase.execute({
                    refBonus: packet.refBonus,
                    userId: userManager?.parent.toHexString() as any,
                    context: context,
                    currency: packet.currency,
                    count: 1
                });
            });
        }

        return Result.ok(true);
    }

    private async getKeyObjects(packetId: string | undefined, customPacket: any | undefined, organizationId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const globalGotten = await this.globalRepo.getGlobal()!;
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        let packet: IPacket;
        
        if (packetId) {
            const packetFound = await this.packetRepo.findById(packetId);
            if (packetFound.isFailure) {
                return Result.fail(packetFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet') : UseCaseError.create('y'));
            }

            packet = packetFound.getValue()!;
        } else {
            packet = new PacketModel({
                ...customPacket,
                disabled: false
            });
        }

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let userManager: IUser | undefined;
        if (organization.manager) {
            const userManagerFound = await this.userRepo.findById(organization.manager.toString());
            if (userManagerFound.isSuccess) {
                userManager = userManagerFound.getValue()!;
            }
        }

        let legal: ILegal | undefined;

        const legalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (legalFound.isSuccess) {
            legal = legalFound.getValue()!;
        }

        return Result.ok({
            global,
            organization,
            packet,
            userManager,
            legal
        });
    }
}
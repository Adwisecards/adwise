import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWisewinService } from "../../../../../services/wisewinService/IWisewinService";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { TransactionRepo } from "../../../../finance/repo/transactions/implementation/TransactionRepo";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { CreateWalletUseCase } from "../../../../finance/useCases/wallets/createWallet/CreateWalletUseCase";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IInvitationRepo } from "../../../../organizations/repo/invitations/IInvitationRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { CreateUserDTO } from "../createUser/CreateUserDTO";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { SplitUsersDTO } from "./SplitUsersDTO";
import { splitUsersErrors } from "./splitUsersErrors";

export class SplitUsersUseCase implements IUseCase<SplitUsersDTO.Request, SplitUsersDTO.Response> {
    private userRepo: IUserRepo;
    private createUserUseCase: CreateUserUseCase;
    private walletRepo: IWalletRepo;
    private createWalletUseCase: CreateWalletUseCase;
    private organizationRepo: IOrganizationRepo;
    private subscriptionRepo: ISubscriptionRepo;
    private transactionRepo: TransactionRepo;
    private wisewinService: IWisewinService;

    public errors = [
        ...splitUsersErrors
    ];

    constructor(userRepo: IUserRepo, createUserUseCase: CreateUserUseCase, organizationRepo: IOrganizationRepo, createWalletUseCase: CreateWalletUseCase, walletRepo: IWalletRepo, subscriptionRepo: ISubscriptionRepo, transactionRepo: TransactionRepo, wisewinService: IWisewinService) {
        this.userRepo = userRepo;
        this.createUserUseCase = createUserUseCase;
        this.walletRepo = walletRepo;
        this.createWalletUseCase = createWalletUseCase;
        this.organizationRepo = organizationRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.transactionRepo = transactionRepo;
        this.wisewinService = wisewinService;
    }

    public async execute(_: SplitUsersDTO.Request): Promise<SplitUsersDTO.Response> {
        const usersFound = await this.userRepo.getAll();
        if (usersFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding users'));
        }

        const users = usersFound.getValue()!;

        const doubleUsers = users.filter(u => (u.phone && u.email) || (u.phone && u.wisewinId));

        const userIds: string[] = [];
        for (const doubleUser of doubleUsers) {

            let organization: IOrganization;
            const organizationFound = await this.organizationRepo.findById(doubleUser.organization as any);
            if (organizationFound.isSuccess) {
                organization = organizationFound.getValue()!;
            }

            const walletFound = await this.walletRepo.findById(doubleUser.wallet.toString());
            if (walletFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding wallet'));
            }

            const wallet = walletFound.getValue()!;

            const fromTransactionsFound = await this.transactionRepo.findByFrom(wallet._id);
            if (fromTransactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding from transactions'));
            }

            const fromTransactions = fromTransactionsFound.getValue()!;

            const toTransactionsFound = await this.transactionRepo.findByTo(wallet._id);
            if (toTransactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding to transactions'));
            }

            const toTransactions = toTransactionsFound.getValue()!;

            doubleUser.emailInfo = doubleUser.email;
            doubleUser.email = '';

            const wisewinId = doubleUser.wisewinId;
            doubleUser.wisewinId = '';

            const organizationPacketsSold = doubleUser.organizationPacketsSold;
            doubleUser.organizationPacketsSold = 0;

            const parent = doubleUser.parent;
            doubleUser.parent = undefined as any;

            doubleUser.organization = undefined as any;

            const doubleUserSaved = await this.userRepo.save(doubleUser);
            if (doubleUserSaved.isFailure) {
                console.log(doubleUserSaved.getError());
                return Result.fail(UseCaseError.create('a', 'Error upon saving MP user'));
            }

            if (wisewinId && doubleUser.phone && !organization!) {
                const wisewinUserFound = await this.wisewinService.getUser(wisewinId);
                if (wisewinUserFound.isSuccess) {
                    continue;
                }
            }

            let crmUserCreated: CreateUserDTO.Response;

            console.log(doubleUser.emailInfo, wisewinId, doubleUser.phone);
            if (doubleUser.email || doubleUser.emailInfo) {
                console.log('EMAIL');
                crmUserCreated = await this.createUserUseCase.execute({
                    dob: doubleUser.dob as any,
                    email: doubleUser.emailInfo || doubleUser.email,
                    firstName: doubleUser.firstName,
                    gender: doubleUser.gender,
                    lastName: doubleUser.lastName,
                    organizationUser: true,
                    password: '12345678',
                    phone: undefined as any,
                    noVerification: true,
                    noCheck: false,
                    parentRefCode: undefined as any
                });
            } else {
                console.log('WISEWIN');

                const wisewinUserFound = await this.wisewinService.getUser(wisewinId);
                if (wisewinUserFound.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon getting wisewin user'));
                }

                const wisewinUser = wisewinUserFound.getValue()!;

                crmUserCreated = await this.createUserUseCase.execute({
                    dob: doubleUser.dob as any,
                    email: doubleUser.email || doubleUser.emailInfo || wisewinUser.email,
                    firstName: doubleUser.firstName,
                    lastName: doubleUser.lastName,
                    gender: doubleUser.gender,
                    noVerification: true,
                    organizationUser: true,
                    password: '12345678',
                    phone: undefined as any,
                    noCheck: false,
                    parentRefCode: undefined as any
                });
            }

            if (crmUserCreated.isFailure) {
                console.log(crmUserCreated.getError());
                return Result.fail(UseCaseError.create('a', 'Error upon creating CRM user'));
            }

            const crmUserFound = await this.userRepo.findById(crmUserCreated.getValue()!.userId);
            if (crmUserFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
            }

            const crmUser = crmUserFound.getValue()!;
            
            const crmWalletFound = await this.walletRepo.findById(crmUser.wallet.toString());
            if (crmWalletFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding wallet'));
            }

            const crmWallet = crmWalletFound.getValue()!;

            const crmToTransactions = toTransactions.filter(t => t.type == 'packet' || t.type == 'packetRef' || t.type == 'managerPercent');

            const crmFromTransactions = fromTransactions.filter(t => t.type == 'withdrawal' || t.type == 'correct');

            for (const crmToTransaction of crmToTransactions) {
                crmToTransaction.to = crmWallet._id;
                
                const crmToTransactionSaved = await this.transactionRepo.save(crmToTransaction);
                
                if (crmToTransactionSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving transaction'));
                }
            }

            for (const crmFromTransaction of crmFromTransactions) {
                crmFromTransaction.from = crmWallet._id;
                
                const crmFromTransactionSaved = await this.transactionRepo.save(crmFromTransaction);
                
                if (crmFromTransactionSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving transaction'));
                }
            }

            if (organization!) {
                organization!.user = crmUser._id;
                crmUser.organization = organization!._id;
                const organizationSaved = await this.organizationRepo.save(organization!);
                if (organizationSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
                }
            }

            crmUser.picture = doubleUser.picture;
            crmUser.password = doubleUser.password;

            crmUser.phoneInfo = doubleUser.phone;
            crmUser.phone = '';
            crmUser.organizationPacketsSold = organizationPacketsSold;
            crmUser.parent = parent;      

            const crmUserSaved = await this.userRepo.save(crmUser);
            if (crmUserSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving crm user'));
            }

            const childUsersFound = await this.userRepo.findByParent(crmUser._id);
            if (childUsersFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding child users'));
            }

            const childUsers = childUsersFound.getValue()!;
            
            for (const childUser of childUsers) {
                childUser.parent = crmUser._id;
                
                const childUserSaved = await this.userRepo.save(childUser);
                if (childUserSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving child user'));
                }
            }

            userIds.push(crmUser._id);
            console.log(crmUser._id);
        }

        return Result.ok({userIds});
    }
}
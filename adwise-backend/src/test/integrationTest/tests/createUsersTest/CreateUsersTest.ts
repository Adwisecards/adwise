import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IWallet } from "../../../../app/modules/finance/models/Wallet";
import { IWalletRepo } from "../../../../app/modules/finance/repo/wallets/IWalletRepo";
import { IUser } from "../../../../app/modules/users/models/User";
import { IUserRepo } from "../../../../app/modules/users/repo/users/IUserRepo";
import { CreateUserDTO } from "../../../../app/modules/users/useCases/users/createUser/CreateUserDTO";
import { CreateUserUseCase } from "../../../../app/modules/users/useCases/users/createUser/CreateUserUseCase";

interface ICreateUsersObjects {
    organizationUser: IUser;
    clientUser: IUser;
    organizationUserWallet: IWallet;
    clientUserWallet: IWallet;
};

export class CreateUsersTest {
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private createUserUseCase: CreateUserUseCase;

    constructor(
        userRepo: IUserRepo,
        walletRepo: IWalletRepo,
        createUserUseCase: CreateUserUseCase
    ) {
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.createUserUseCase = createUserUseCase;
    }

    public async execute(): Promise<Result<ICreateUsersObjects | null, UseCaseError | null>> {
        const organizationUserData: CreateUserDTO.Request = {
            email: 'example@gmail.com',
            firstName: 'firstName',
            lastName: 'lastName',
            noVerification: true,
            organizationUser: false,
            password: 'password123',
            dob: undefined as any,
            gender: undefined as any,
            noCheck: undefined as any,
            parentRefCode: undefined as any,
            phone: undefined as any,
            deviceToken: undefined as any,
            deviceTokenBusiness: undefined as any,
            language: undefined as any,
            pictureMediaId: undefined as any,
            pushNotificationsEnabled: undefined as any,
            pushToken: undefined as any,
            pushTokenBusiness: undefined as any 
        };

        const organizationUserCreated = await this.createUserUseCase.execute(organizationUserData);
        if (organizationUserCreated.isFailure) {
            return Result.fail(organizationUserCreated.getError());
        }

        const organizationUserId = organizationUserCreated.getValue()!.userId;

        const organizationUserFound = await this.userRepo.findById(organizationUserId);
        if (organizationUserFound.isFailure) {
            return Result.fail(organizationUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization user') : UseCaseError.create('m', 'Organization user does not exist'));
        }

        const organizationUser = organizationUserFound.getValue()!;

        const clientUserData: CreateUserDTO.Request = {
            email: undefined as any,
            firstName: 'firstName',
            lastName: 'lastName',
            noVerification: true,
            organizationUser: false,
            password: 'password123',
            dob: undefined as any,
            gender: undefined as any,
            noCheck: undefined as any,
            parentRefCode: undefined as any,
            phone: '79958454343',
            deviceToken: undefined as any,
            deviceTokenBusiness: undefined as any,
            language: undefined as any,
            pictureMediaId: undefined as any,
            pushNotificationsEnabled: undefined as any,
            pushToken: undefined as any,
            pushTokenBusiness: undefined as any
        };

        const clientUserCreated = await this.createUserUseCase.execute(clientUserData);
        if (clientUserCreated.isFailure) {
            return Result.fail(clientUserCreated.getError());
        }

        const clientUserId = clientUserCreated.getValue()!.userId;

        const clientUserFound = await this.userRepo.findById(clientUserId);
        if (clientUserFound.isFailure) {
            return Result.fail(clientUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding client user') : UseCaseError.create('m', 'Client user does not exist'));
        }

        const clientUser = clientUserFound.getValue()!;

        // Check personal contact card

        if (!organizationUser.wallet) {
            return Result.fail(UseCaseError.create('c', 'Organization user does not point to no wallet'));
        }

        const organizationUserWalletFound = await this.walletRepo.findById(organizationUser.wallet.toString());
        if (organizationUserWalletFound.isFailure) {
            return Result.fail(organizationUserWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const organizationUserWallet = organizationUserWalletFound.getValue()!;

        if (!organizationUserWallet.user) {
            return Result.fail(UseCaseError.create('c', 'Organization user wallet does not point to no user'));
        }

        if (organizationUserWallet.user.toString() != organizationUser._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Organization user wallet pointing to incorrect user'));
        }

        // client wallet

        if (!clientUser.wallet) {
            return Result.fail(UseCaseError.create('c', 'Client user does not point to no wallet'));
        }

        const clientUserWalletFound = await this.walletRepo.findById(clientUser.wallet.toString());
        if (clientUserWalletFound.isFailure) {
            return Result.fail(clientUserWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const clientUserWallet = clientUserWalletFound.getValue()!;

        if (!clientUserWallet.user) {
            return Result.fail(UseCaseError.create('c', 'Client user wallet does not point to no user'));
        }

        if (clientUserWallet.user.toString() != clientUser._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Client user wallet pointing to incorrect user'));
        }

        const testUserData = [organizationUserData, clientUserData];
        const testUsers = [organizationUser, clientUser];

        for (const index in testUserData) {
            const userData = testUserData[index];
            const user = testUsers[index];

            if (userData.email != user.email) {
                return Result.fail(UseCaseError.create('c', 'Email is not correct'));
            }

            if (userData.firstName != user.firstName) {
                return Result.fail(UseCaseError.create('c', 'First name is not correct'));
            }

            if (userData.phone != user.phone) {
                return Result.fail(UseCaseError.create('c', 'Phone is not correct'));
            }

            const isPasswordCorrect = user.comparePassword(userData.password);

            if (!isPasswordCorrect) {
                return Result.fail(UseCaseError.create('c', 'Password is not correct'));
            }
        }

        return Result.ok({
            clientUser,
            organizationUser,
            clientUserWallet,
            organizationUserWallet
        });
    }
};
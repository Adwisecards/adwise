import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IContact } from "../../../../app/modules/contacts/models/Contact";
import { IContactRepo } from "../../../../app/modules/contacts/repo/contacts/IContactRepo";
import { IWallet } from "../../../../app/modules/finance/models/Wallet";
import { IWalletRepo } from "../../../../app/modules/finance/repo/wallets/IWalletRepo";
import { IAddress } from "../../../../app/modules/maps/models/Address";
import { ICategory } from "../../../../app/modules/organizations/models/Category";
import { IEmployee } from "../../../../app/modules/organizations/models/Employee";
import { IOrganization } from "../../../../app/modules/organizations/models/Organization";
import { IPacket } from "../../../../app/modules/organizations/models/Packet";
import { IEmployeeRepo } from "../../../../app/modules/organizations/repo/employees/IEmployeeRepo";
import { IOrganizationRepo } from "../../../../app/modules/organizations/repo/organizations/IOrganizationRepo";
import { CreateOrganizationDTO } from "../../../../app/modules/organizations/useCases/organizations/createOrganization/CreateOrganizationDTO";
import { CreateOrganizationUseCase } from "../../../../app/modules/organizations/useCases/organizations/createOrganization/CreateOrganizationUseCase";
import { IUser } from "../../../../app/modules/users/models/User";
import { IUserRepo } from "../../../../app/modules/users/repo/users/IUserRepo";

interface ICreateOrganizationObjects {
    organization: IOrganization;
    organizationWallet: IWallet;
    organizationUser: IUser;
    defaultCashierContact: IContact;
    defaultCashierEmployee: IEmployee;
};

export class CreateOrganizationTest {
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private contactRepo: IContactRepo;
    private employeeRepo: IEmployeeRepo;
    private organizationRepo: IOrganizationRepo;
    private createOrganizationUseCase: CreateOrganizationUseCase;

    constructor(
        userRepo: IUserRepo,
        walletRepo: IWalletRepo,
        contactRepo: IContactRepo,
        employeeRepo: IEmployeeRepo,
        organizationRepo: IOrganizationRepo,
        createOrganizationUseCase: CreateOrganizationUseCase
    ) {
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.contactRepo = contactRepo;
        this.employeeRepo = employeeRepo;
        this.organizationRepo = organizationRepo;
        this.createOrganizationUseCase = createOrganizationUseCase;
    }

    public async execute(organizationUser: IUser, category: ICategory, address: IAddress, packet: IPacket): Promise<Result<ICreateOrganizationObjects | null, UseCaseError | null>> {
        const organizationData: CreateOrganizationDTO.Request = {
            addressId: address._id.toString(),
            briefDescription: 'briefDescription',
            cashback: 10,
            distributionSchema: {
                first: 10,
                other: 21
            },
            categoryId: category._id.toString(),
            colors: {
                primary: '#000',
                secondary: '#fff'
            },
            description: 'description',
            emails: ['email1@gmail.com', 'yazaebalsyatakjit@spasite.help'],
            name: 'name',
            phones: ['79999999999'],
            requestedPacketId: packet._id.toString(),
            tags: ['tag1', 'tag2', 'tag3'],
            schedule: {
                friday: {
                    from: '09:30',
                    to: '23:00'
                },
                monday: {
                    from: '09:30',
                    to: '23:00'
                },
                saturday: {
                    from: '09:30',
                    to: '23:00'
                },
                sunday: {
                    from: '09:30',
                    to: '23:00'
                },
                thursday: {
                    from: '09:30',
                    to: '23:00'
                },
                tuesday: {
                    from: '09:30',
                    to: '23:00'
                },
                wednesday: {
                    from: '09:30',
                    to: '23:00'
                }
            },
            socialMedia: {
                fb: 'https://fb.com/123',
                insta: 'https://insta.com/123',
                vk: 'https://vk.com/123'
            },
            userId: organizationUser._id.toString(),
            mainPictureMediaId: undefined as any,
            pictureMediaId: undefined as any
        };
    
        const organizationCreated = await this.createOrganizationUseCase.execute(organizationData);
        if (organizationCreated.isFailure) {
            return Result.fail(organizationCreated.getError()!);
        }

        const { organizationId } = organizationCreated.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l', 'Organization does not exist'));
        }

        const organization = organizationFound.getValue()!;

        const organizationUserFound = await this.userRepo.findById(organizationUser._id.toString());
        if (organizationUserFound.isFailure) {
            return Result.fail(organizationUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization user') : UseCaseError.create('m', 'Organization user does not exist'));
        }

        organizationUser = organizationUserFound.getValue()!;

        if (!organization.wallet) {
            return Result.fail(UseCaseError.create('c', 'Organization does not point to no wallet'))
        }

        const organizationWalletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (organizationWalletFound.isFailure) {
            return Result.fail(organizationWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization wallet') : UseCaseError.create('r')); 
        }

        const organizationWallet = organizationWalletFound.getValue()!;

        if (!organizationWallet.organization) {
            return Result.fail(UseCaseError.create('c', 'Organization wallet does not point to no organization'));
        }

        const walletPointsSum = organizationWallet.points + organizationWallet.bonusPoints + organizationWallet.cashbackPoints + organizationWallet.frozenPointsSum + organizationWallet.deposit;
        if (walletPointsSum) {
            return Result.fail(UseCaseError.create('c', 'Organization wallet is not empty'));
        }
        
        if (!organization.defaultCashier) {
            return Result.fail(UseCaseError.create('c', 'Default cashier does not exist'))
        }

        const defaultCashierContactFound = await this.contactRepo.findById(organization.defaultCashier.toString());
        if (defaultCashierContactFound.isFailure) {
            return Result.fail(defaultCashierContactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding default cashier contact') : UseCaseError.create('w', 'Default cashier contact does not exist'));
        }

        const defaultCashierContact = defaultCashierContactFound.getValue()!;
        
        if (!defaultCashierContact.employee) {
            return Result.fail(UseCaseError.create('c', 'Default cashier employee does not exist'));
        }

        const defaultCashierEmployeeFound = await this.employeeRepo.findById(defaultCashierContact.employee.toString());
        if (defaultCashierEmployeeFound.isFailure) {
            return Result.fail(defaultCashierEmployeeFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding default cashier employee') : UseCaseError.create('x', 'Default cashier employee does not exist'));
        }

        const defaultCashierEmployee = defaultCashierEmployeeFound.getValue()!;

        if (!defaultCashierEmployee.organization) {
            return Result.fail(UseCaseError.create('c', 'Default cashier employee does not pointing to no organization'));
        }

        if (defaultCashierEmployee.organization.toString() != organization._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Default cashier employee pointing to incorrect organization'));
        }

        if (!defaultCashierEmployee.contact) {
            return Result.fail(UseCaseError.create('c', 'Default cashier employee does not point to no contact'));
        }

        if (defaultCashierEmployee.contact.toString() != defaultCashierContact._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Default cashier employee pointing to incorrect contact'));
        }

        if (!defaultCashierContact.organization) {
            return Result.fail(UseCaseError.create('c', 'Default cashier contact does not point to no organization'));
        }

        if (defaultCashierContact.organization.toString() != organization._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Default cashier contact pointing to incorrect organization'));
        }

        if (!defaultCashierContact.employee) {
            return Result.fail(UseCaseError.create('c', 'Default cashier contact does not point to no employee'));
        }

        if (defaultCashierContact.employee.toString() != defaultCashierEmployee._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Default cashier contact pointing to incorrect employee'));
        }

        if (!defaultCashierContact.ref) {
            return Result.fail(UseCaseError.create('c', 'Default cashier contact does not point to no user'));
        }

        if (defaultCashierContact.ref.toString() != organizationUser._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Default cashier contact pointing to incorrect user'));
        }

        if (!organizationUser.organization) {
            return Result.fail(UseCaseError.create('c', 'Organization user does not point to no organization'));
        }

        if (organizationUser.organization.toString() != organization._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Organization user pointing to incorrect organization'));
        }

        if (!organization.user) {
            return Result.fail(UseCaseError.create('c', 'Organization does not point to no user'));
        }

        if (organization.user.toString() != organizationUser._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Organization pointing to incorrect user'));
        }

        return Result.ok({
            defaultCashierContact,
            defaultCashierEmployee,
            organization,
            organizationUser,
            organizationWallet
        });
    }
}